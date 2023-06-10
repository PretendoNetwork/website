const Stripe = require('stripe');
const mailer = require('./mailer');
const util = require('./util');
const database = require('./database');
const logger = require('./logger');
const config = require('../config.json');

const stripe = new Stripe(config.stripe.secret_key);

async function handleStripeEvent(event) {
	if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
		const subscription = event.data.object;
		const product = await stripe.products.retrieve(subscription.plan.product);
		const customer = await stripe.customers.retrieve(subscription.customer);

		if (!customer?.metadata?.pnid_pid) {
			// No PNID PID linked to customer
			if (subscription.status !== 'canceled' && subscription.status !== 'unpaid') {
				// Abort and refund!
				logger.error(`Stripe user ${customer.id} has no PNID linked! Refunding order`);

				try {
					await stripe.subscriptions.del(subscription.id);

					const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
					await stripe.refunds.create({
						payment_intent: invoice.payment_intent
					});
				} catch (error) {
					logger.error(`Error refunding subscription | ${customer.id}, ${subscription.id} | - ${error.message}`);
				}

				try {
					await mailer.sendMail({
						to: customer.email,
						subject: 'Pretendo Network Subscription Failed - No Linked PNID',
						text: `Your recent subscription to Pretendo Network has failed.\nThis is due to no PNID PID being linked to the Stripe customer account used. The subscription has been canceled and refunded. Please contact Jon immediately.\nStripe Customer ID: ${customer.id}`
					});
				} catch (error) {
					logger.error(`Error sending email | ${customer.id}, ${customer.email} | - ${error.message}`);
				}
			} else {
				logger.error(`Stripe user ${customer.id} has no PNID linked!`);
			}

			return;
		}

		const pid = Number(customer.metadata.pnid_pid);
		const pnid = await database.PNID.findOne({ pid });

		if (!pnid) {
			// PNID does not exist
			if (subscription.status !== 'canceled' && subscription.status !== 'unpaid') {
				// Abort and refund!
				logger.error(`PNID PID ${pid} does not exist! Found on Stripe user ${customer.id}! Refunding order`);

				try {
					await stripe.subscriptions.del(subscription.id);

					const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
					await stripe.refunds.create({
						payment_intent: invoice.payment_intent
					});
				} catch (error) {
					logger.error(`Error refunding subscription | ${customer.id}, ${subscription.id} | - ${error.message}`);
				}

				try {
					await mailer.sendMail({
						to: customer.email,
						subject: 'Pretendo Network Subscription Failed - PNID Not Found',
						text: `Your recent subscription to Pretendo Network has failed.\nThis is due to the provided PNID not being found. The subscription has been canceled and refunded. Please contact Jon immediately.\nStripe Customer ID: ${customer.id}\nPNID PID: ${pid}`
					});
				} catch (error) {
					logger.error(`Error sending email | ${customer.id}, ${customer.email} | - ${error.message}`);
				}
			} else {
				logger.error(`PNID PID ${pid} does not exist! Found on Stripe user ${customer.id}!`);
			}

			return;
		}

		const latestWebhookTimestamp = pnid.get('connections.stripe.latest_webhook_timestamp');

		if (latestWebhookTimestamp && latestWebhookTimestamp >= event.created) {
			// Do nothing, this webhook is older than the latest seen
			return;
		}

		const currentSubscriptionId = pnid.get('connections.stripe.subscription_id');
		const discordId = pnid.get('connections.discord.id');

		if (subscription.status === 'canceled' && currentSubscriptionId && subscription.id !== currentSubscriptionId) {
			// Canceling old subscription, do nothing but update webhook date and remove Discord roles
			if (product.metadata.beta === 'true') {
				util.removeDiscordMemberTesterRole(discordId).catch(error => {
					logger.error(`Error removing user Discord tester role | ${customer.id}, ${discordId}, ${pid} | - ${error.message}`);
				});
			}

			util.removeDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
				logger.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} | - ${error.message}`);
			});

			const updateData = {
				'connections.stripe.latest_webhook_timestamp': event.created
			};

			await database.PNID.updateOne({
				pid,
				'connections.stripe.latest_webhook_timestamp': {
					$lte: event.created
				}
			}, { $set: updateData }).exec();

			return;
		}

		const updateData = {
			'connections.stripe.subscription_id': subscription.status === 'active' ? subscription.id : null,
			'connections.stripe.price_id': subscription.status === 'active' ? subscription.plan.id : null,
			'connections.stripe.tier_level': subscription.status === 'active' ? Number(product.metadata.tier_level || 0) : 0,
			'connections.stripe.tier_name': subscription.status === 'active' ? product.name : null,
			'connections.stripe.latest_webhook_timestamp': event.created,
		};

		if (product.metadata.beta === 'true') {
			if (subscription.status === 'active') {
				if (pnid.access_level < 2) { // * Only change access level if not staff member
					updateData.access_level = 1;
					updateData.server_access_level = 'test';
				}

				util.assignDiscordMemberTesterRole(discordId).catch(error => {
					logger.error(`Error assigning user Discord tester role | ${customer.id}, ${discordId}, ${pid} | - ${error.message}`);
				});
			} else {
				// * Assume any status other than active means payment has not been fulfilled
				// * Once the payment goes through, status should update to active
				if (pnid.access_level < 2) { // * Only change access level if not staff member
					updateData.access_level = 0;
					updateData.server_access_level = 'prod';
				}

				util.removeDiscordMemberTesterRole(discordId).catch(error => {
					logger.error(`Error removing user Discord tester role | ${customer.id}, ${discordId}, ${pid} | - ${error.message}`);
				});
			}
		}

		await database.PNID.updateOne({
			pid,
			'connections.stripe.latest_webhook_timestamp': {
				$lte: event.created
			}
		}, { $set: updateData }).exec();

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
					await stripe.subscriptions.del(pastSubscription.id);
				} catch (error) {
					logger.error(`Error canceling old user subscription | ${customer.id}, ${pid}, ${pastSubscription.id} | - ${error.message}`);
				}
			}

			try {
				await mailer.sendMail({
					to: customer.email,
					subject: `Pretendo Network ${product.name} Subscription - Active`,
					text: `Thank you for purchasing the ${product.name} tier! We greatly value your support, thank you for helping keep Pretendo Network alive!\nIt may take a moment for your account dashboard to reflect these changes. Please wait a moment and refresh the dashboard to see them!`
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email}, ${pid} | - ${error.message}`);
			}

			util.assignDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
				logger.error(`Error assigning user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} | - ${error.message}`);
			});

			for (const email of config.stripe.notification_emails) {
				// * Send notification emails for new sub
				try {
					await mailer.sendMail({
						to: email,
						subject: `[Pretendo] - New ${product.name} subscription`,
						text: `${pnid.get('username')} just became a ${product.name} tier subscriber`
					});
				} catch (error) {
					logger.error(`Error sending notification email | ${email} | - ${error.message}`);
				}
			}
		} else if (subscription.status === 'canceled') {
			try {
				await mailer.sendMail({
					to: customer.email,
					subject: `Pretendo Network ${product.name} Subscription - Canceled`,
					text: `Your subscription for the ${product.name} tier has been canceled. We thank for your previous support, and hope you still enjoy the network! `
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email}, ${pid} | - ${error.message}`);
			}

			util.removeDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
				logger.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} | - ${error.message}`);
			});

			for (const email of config.stripe.notification_emails) {
				// * Send notification emails for new sub
				try {
					await mailer.sendMail({
						to: email,
						subject: `[Pretendo] - Canceled ${product.name} subscription`,
						text: `${pnid.get('username')} just canceled their ${product.name} tier subscription`
					});
				} catch (error) {
					logger.error(`Error sending notification email | ${email} | - ${error.message}`);
				}
			}
		} else if (subscription.status === 'unpaid') {
			try {
				await mailer.sendMail({
					to: customer.email,
					subject: `Pretendo Network ${product.name} Subscription - Unpaid`,
					text: `Your subscription for the ${product.name} tier has been canceled due to non payment. We thank for your previous support, and hope you still enjoy the network! `
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email}, ${pid} | - ${error.message}`);
			}

			util.removeDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
				logger.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} | - ${error.message}`);
			});

			for (const email of config.stripe.notification_emails) {
				// * Send notification emails for new sub
				try {
					await mailer.sendMail({
						to: email,
						subject: `[Pretendo] - Removed ${product.name} subscription`,
						text: `${pnid.get('username')}'s ${product.name} tier subscription has been canceled due to non payment`
					});
				} catch (error) {
					logger.error(`Error sending notification email | ${email} | - ${error.message}`);
				}
			}
		} else {
			try {
				await mailer.sendMail({
					to: customer.email,
					subject: `Pretendo Network ${product.name} Subscription - ${subscription.status}`,
					text: `Your subscription for the ${product.name} tier has changed status to ${subscription.status}. This is usually caused by payment failure. Your account has been reverted back to default until payment resumes. If you believe this to be an error, please reach out for support on our Discord server, and we thank you for your previous support!`
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email}, ${pid} | - ${error.message}`);
			}

			util.removeDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
				logger.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} | - ${error.message}`);
			});

			for (const email of config.stripe.notification_emails) {
				// * Send notification emails for new sub
				try {
					await mailer.sendMail({
						to: email,
						subject: `[Pretendo] - Removed ${product.name} subscription`,
						text: `${pnid.username}'s ${product.name} tier subscription status has been changed to ${subscription.status}`
					});
				} catch (error) {
					logger.error(`Error sending notification email | ${email} | - ${error.message}`);
				}
			}
		}
	}
}

module.exports = {
	handleStripeEvent
};
