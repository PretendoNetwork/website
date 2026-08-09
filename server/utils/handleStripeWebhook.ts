import { Stripe } from "stripe";
import { useMailer } from "./mailer";
import { PnidDocument, usePapr } from "./papr";
import { Transporter } from "nodemailer";
import { PaprMatchKeysAndValues } from "papr";
import type { H3Event } from 'h3';
import { assignDiscordMemberSupporterRole, assignDiscordMemberTesterRole, removeDiscordMemberSupporterRole, removeDiscordMemberTesterRole, useDiscord } from "./discord";

async function sendEmailToCustomer(mailer: Transporter, customer: Stripe.Customer, ops: { pid: number, title: string, body: string }): Promise<void> {
	try {
		if (!customer.email) throw new Error("Customer does not have an email");
		await mailer.sendMail({
			to: customer.email,
			subject: ops.title,
			text: ops.body,
		});
	} catch (error) {
		console.error(`Error sending email | ${customer.id}, ${ops.pid}, ${customer.email} |`, error);
	}
}

async function sendToNotificationEmails(mailer: Transporter, notificationEmails: string[], ops: { title: string, body: string }): Promise<void> {
	for (const email of notificationEmails) {
		// * Send notification emails for new sub
		try {
			await mailer.sendMail({
				to: email,
				subject: `[Pretendo] - ${ops.title}`,
				text: ops.body,
			});
		} catch (error) {
			console.error(`Error sending notification email | ${email} |`, error);
		}
	}
}

export async function handleStripeEvent(event: H3Event, stripe: Stripe, webhook: Stripe.Event, notificationEmails: string[]) {
	const mailer = useMailer(event);
	const discord = useDiscord(event);
	const papr = await usePapr(event);

	if (!mailer || !papr) {
		console.warn('Mailer/database not configured, ignoring stripe webhook');
		return;
	}

	if (webhook.type === 'customer.subscription.updated' || webhook.type === 'customer.subscription.deleted') {
		const subscription = webhook.data.object;
		const subscriptionItem = subscription.items.data[0];
		if (!subscriptionItem) throw new Error("No subscription item subscription");
		const product = await stripe.products.retrieve(subscriptionItem.plan.product as string);
		const customer = await stripe.customers.retrieve(subscription.customer as string);

		if (customer.deleted) {
			// Customer doesn't exist, no need to do anything
			return;
		}

		if (!customer?.metadata?.pnid_pid) {
			// No PNID PID linked to customer
			if (subscription.status !== 'canceled' && subscription.status !== 'unpaid') {
				// Abort and refund!
				console.error(`Stripe user ${customer.id} has no PNID linked! Refunding order`);

				try {
					await stripe.subscriptions.cancel(subscription.id);

					const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
					const intent = invoice.payments?.data[0]?.payment.payment_intent;
					if (!intent) throw new Error("No intent found")
					await stripe.refunds.create({
						payment_intent: intent as string
					});
				} catch (error) {
					console.error(`Error refunding subscription | ${customer.id}, ${subscription.id}`, error);
				}

				await sendEmailToCustomer(mailer, customer, {
					pid: 0,
					title: 'Pretendo Network Subscription Failed - No Linked PNID',
					body: `Your recent subscription to Pretendo Network has failed.\nThis is due to no PNID PID being linked to the Stripe customer account used. The subscription has been canceled and refunded. Please contact Jon immediately.\nStripe Customer ID: ${customer.id}`
				})
			} else {
				console.error(`Stripe user ${customer.id} has no PNID linked!`);
			}

			return;
		}

		const pid = Number(customer.metadata.pnid_pid);
		const pnid = await papr.Pnid.findOne({ pid });

		if (!pnid) {
			// PNID does not exist
			if (subscription.status !== 'canceled' && subscription.status !== 'unpaid') {
				// Abort and refund!
				console.error(`PNID PID ${pid} does not exist! Found on Stripe user ${customer.id}! Refunding order`);

				try {
					await stripe.subscriptions.cancel(subscription.id);

					if (subscription.latest_invoice) {
						const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
						const intent = invoice.payments?.data[0]?.payment.payment_intent;
						if (!intent) throw new Error("No intent found")
						await stripe.refunds.create({
							payment_intent: intent as string
						});
					}
				} catch (error) {
					console.error(`Error refunding subscription | ${customer.id}, ${subscription.id} |`, error);
				}

				await sendEmailToCustomer(mailer, customer, {
					pid: 0,
					title: 'Pretendo Network Subscription Failed - PNID Not Found',
					body: `Your recent subscription to Pretendo Network has failed.\nThis is due to the provided PNID not being found. The subscription has been canceled and refunded. Please contact Jon immediately.\nStripe Customer ID: ${customer.id}\nPNID PID: ${pid}`
				})
			} else {
				console.error(`PNID PID ${pid} does not exist! Found on Stripe user ${customer.id}!`);
			}

			return;
		}

		const latestWebhookTimestamp = pnid.connections?.stripe?.latest_webhook_timestamp;

		if (latestWebhookTimestamp && latestWebhookTimestamp >= webhook.created) {
			// Do nothing, this webhook is older than the latest seen
			return;
		}

		const currentSubscriptionId = pnid.connections?.stripe?.subscription_id;
		const discordId = pnid.connections?.discord?.id;

		if (subscription.status === 'canceled' && currentSubscriptionId && subscription.id !== currentSubscriptionId) {
			// Canceling old subscription, do nothing but update webhook date and remove Discord roles
			if (product.metadata.beta === 'true') {
				if (discord && discordId) {
					await removeDiscordMemberTesterRole(discord, discordId).catch((error) => {
						console.error(`Error removing user Discord tester role | ${customer.id}, ${discordId}, ${pid} |`, error);
					});
				}
			}

			if (discord && discordId && product.metadata.discord_role_id) {
				await removeDiscordMemberSupporterRole(discord, discordId, product.metadata.discord_role_id).catch((error) => {
					console.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} |`, error);
				});
			}

			await papr.Pnid.updateOne({
				pid,
				'connections.stripe.latest_webhook_timestamp': {
					$lte: webhook.created
				}
			}, {
				$set: {
					'connections.stripe.latest_webhook_timestamp': webhook.created
				}
			});

			return;
		}

		const updateData: PaprMatchKeysAndValues<PnidDocument> = {
			'connections.stripe.subscription_id': subscription.status === 'active' ? subscription.id : undefined,
			'connections.stripe.price_id': subscription.status === 'active' ? subscriptionItem.plan.id : undefined,
			'connections.stripe.tier_level': subscription.status === 'active' ? Number(product.metadata.tier_level || 0) : 0,
			'connections.stripe.tier_name': subscription.status === 'active' ? product.name : undefined,
			'connections.stripe.latest_webhook_timestamp': webhook.created
		};

		if (product.metadata.beta === 'true') {
			if (subscription.status === 'active') {
				if (pnid.access_level < 2) { // * Only change access level if not staff member
					updateData.access_level = 1;
					updateData.server_access_level = 'test';
				}

				if (discord && discordId) {
					await assignDiscordMemberTesterRole(discord, discordId).catch((error) => {
						console.error(`Error assigning user Discord tester role | ${customer.id}, ${discordId}, ${pid} |`, error);
					});
				}
			} else {
				// * Assume any status other than active means payment has not been fulfilled
				// * Once the payment goes through, status should update to active
				if (pnid.access_level < 2) { // * Only change access level if not staff member
					updateData.access_level = 0;
					updateData.server_access_level = 'prod';
				}

				if (discord && discordId) {
					await removeDiscordMemberTesterRole(discord, discordId).catch((error) => {
						console.error(`Error removing user Discord tester role | ${customer.id}, ${discordId}, ${pid} |`, error);
					});
				}
			}
		}

		await papr.Pnid.updateOne({
			pid,
			'connections.stripe.latest_webhook_timestamp': {
				$lte: webhook.created
			}
		}, {
			$set: updateData
		});

		if (subscription.status === 'active') {
			// Get all the customers active subscriptions
			const { data: activeSubscriptions } = await stripe.subscriptions.list({
				limit: 100,
				status: 'active',
				customer: customer.id
			});

			// Order subscriptions by creation time and remove the latest one
			const orderedActiveSubscriptions = activeSubscriptions.sort((a, b) => b.created - a.created);
			const pastSubscriptions = orderedActiveSubscriptions.slice(1);

			// Remove any old past subscriptions that might still be hanging around
			for (const pastSubscription of pastSubscriptions) {
				try {
					await stripe.subscriptions.cancel(pastSubscription.id);
				} catch (error) {
					console.error(`Error canceling old user subscription | ${customer.id}, ${pid}, ${pastSubscription.id} |`, error);
				}
			}

			await sendEmailToCustomer(mailer, customer, {
				pid,
				title: `Pretendo Network ${product.name} Subscription - Active`,
				body: `Thank you for purchasing the ${product.name} tier! We greatly value your support, thank you for helping keep Pretendo Network alive!\nIt may take a moment for your account dashboard to reflect these changes. Please wait a moment and refresh the dashboard to see them!`
			})

			if (discord && discordId && product.metadata.discord_role_id) {
				await assignDiscordMemberSupporterRole(discord, discordId, product.metadata.discord_role_id).catch((error) => {
					console.error(`Error assigning user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} |`, error);
				});
			}

			await sendToNotificationEmails(mailer, notificationEmails, {
				title: `New ${product.name} subscription`,
				body: `${pnid.username} just became a ${product.name} tier subscriber`,
			})
		} else if (subscription.status === 'canceled') {
			await sendEmailToCustomer(mailer, customer, {
				pid,
				title: `Pretendo Network ${product.name} Subscription - Canceled`,
				body: `Your subscription for the ${product.name} tier has been canceled. We thank for your previous support, and hope you still enjoy the network! `
			})

			if (discord && discordId && product.metadata.discord_role_id) {
				await removeDiscordMemberSupporterRole(discord, discordId, product.metadata.discord_role_id).catch((error) => {
					console.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} |`, error);
				});
			}

			await sendToNotificationEmails(mailer, notificationEmails, {
				title: `Canceled ${product.name} subscription`,
				body: `${pnid.username} just canceled their ${product.name} tier subscription`,
			})
		} else if (subscription.status === 'unpaid') {
			await sendEmailToCustomer(mailer, customer, {
				pid,
				title: `Pretendo Network ${product.name} Subscription - Unpaid`,
				body: `Your subscription for the ${product.name} tier has been canceled due to non payment. We thank for your previous support, and hope you still enjoy the network! `
			})

			if (discord && discordId && product.metadata.discord_role_id) {
				await removeDiscordMemberSupporterRole(discord, discordId, product.metadata.discord_role_id).catch((error) => {
					console.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} |`, error);
				});
			}

			await sendToNotificationEmails(mailer, notificationEmails, {
				title: `Removed ${product.name} subscription`,
				body: `${pnid.username}'s ${product.name} tier subscription has been canceled due to non payment`,
			})
		} else {
			await sendEmailToCustomer(mailer, customer, {
				pid,
				title: `Pretendo Network ${product.name} Subscription - ${subscription.status}`,
				body: `Your subscription for the ${product.name} tier has changed status to ${subscription.status}. This is usually caused by payment failure. Your account has been reverted back to default until payment resumes. If you believe this to be an error, please reach out for support on our Discord server, and we thank you for your previous support!`
			})

			if (discord && discordId && product.metadata.discord_role_id) {
				await removeDiscordMemberSupporterRole(discord, discordId, product.metadata.discord_role_id).catch((error) => {
					console.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} |`, error);
				});
			}

			await sendToNotificationEmails(mailer, notificationEmails, {
				title: `Removed ${product.name} subscription`,
				body: `${pnid.username}'s ${product.name} tier subscription status has been changed to ${subscription.status}`,
			})
		}
	}
}
