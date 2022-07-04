const fs = require('fs-extra');
const got = require('got');
const crypto = require('crypto');
const Stripe = require('stripe');
const mailer = require('./mailer');
const database = require('./database');
const logger = require('./logger');
const config = require('../config.json');

const stripe = new Stripe(config.stripe.secret_key);

function fullUrl(request) {
	return `${request.protocol}://${request.hostname}${request.originalUrl}`;
}

function getLocale(region, language) {
	const path = `${__dirname}/../locales/${region}_${language}.json`;

	if (fs.pathExistsSync(path)) {
		return require(path);
	}

	logger.warn(`Could not find locale ${region}_${language}! Loading US_en`);

	return require(`${__dirname}/../locales/US_en.json`);
}

function apiGetRequest(path, headers) {
	return got.get(`https://api.pretendo.cc${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers
	});
}

function apiPostGetRequest(path, headers, json) {
	return got.post(`https://api.pretendo.cc${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

function apiDeleteGetRequest(path, headers, json) {
	return got.delete(`https://api.pretendo.cc${path}`, {
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

function nintendoPasswordHash(password, pid) {
	const pidBuffer = Buffer.alloc(4);
	pidBuffer.writeUInt32LE(pid);

	const unpacked = Buffer.concat([
		pidBuffer,
		Buffer.from('\x02\x65\x43\x46'),
		Buffer.from(password)
	]);

	const hashed = crypto.createHash('sha256').update(unpacked).digest().toString('hex');

	return hashed;
}

async function handleStripeEvent(event) {
	if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
		const subscription = event.data.object;
		const product = await stripe.products.retrieve(subscription.plan.product);
		const customer = await stripe.customers.retrieve(subscription.customer);

		if (!customer?.metadata?.pnid_pid && subscription.status !== 'canceled' && subscription.status !== 'unpaid') {
			// No PNID PID linked to customer. Abort and refund!
			logger.error(`Stripe user ${customer.id} has no PNID linked! Refunding order`);

			await stripe.subscriptions.del(subscription.id);

			const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
			await stripe.refunds.create({
				payment_intent: invoice.payment_intent
			});

			try {
				await mailer.sendMail({
					to: customer.email,
					subject: 'Pretendo Network Subscription Failed - No Linked PNID',
					text: `Your recent subscription to Pretendo Network has failed.\nThis is due to no PNID PID being linked to the Stripe customer account used. The subscription has been canceled and refunded. Please contact Jon immediately.\nStripe Customer ID: ${customer.id}`
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email} | - ${error.message}`);
			}


			return;
		}

		const pid = Number(customer.metadata.pnid_pid);
		const pnid = await database.PNID.findOne({ pid });

		const latestWebhookTimestamp = pnid.get('connections.stripe.latest_webhook_timestamp');

		if (latestWebhookTimestamp && latestWebhookTimestamp > event.created) {
			// Do nothing, this webhook is older than the latest seen
			return;
		}

		if (!pnid && subscription.status !== 'canceled' && subscription.status !== 'unpaid') {
			// PNID does not exist. Abort and refund!
			logger.error(`PNID PID ${pid} does not exist! Found on Stripe user ${customer.id}! Refunding order`);

			await stripe.subscriptions.del(subscription.id);

			const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
			await stripe.refunds.create({
				payment_intent: invoice.payment_intent
			});

			try {
				await mailer.sendMail({
					to: customer.email,
					subject: 'Pretendo Network Subscription Failed - PNID Not Found',
					text: `Your recent subscription to Pretendo Network has failed.\nThis is due to the provided PNID not being found. The subscription has been canceled and refunded. Please contact Jon immediately.\nStripe Customer ID: ${customer.id}\nPNID PID: ${pid}`
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email} | - ${error.message}`);
			}

			return;
		}

		const currentSubscriptionId = pnid.get('connections.stripe.subscription_id');

		if (subscription.status === 'canceled' && currentSubscriptionId && subscription.id !== currentSubscriptionId) {
			// Canceling old subscription, do nothing but update webhook date

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
			'connections.stripe.latest_webhook_timestamp': event.created,
		};

		if (product.metadata.beta === 'true') {
			switch (subscription.status) {
				case 'active':
					if (pnid.access_level < 2) { // only change access level if not staff member
						updateData.access_level = 1;
					}
					break;

				case 'canceled': // Subscription was canceled
				case 'unpaid': // User missed too many payments
					if (pnid.access_level < 2) { // only change access level if not staff member
						updateData.access_level = 0;
					}
					break;

				default:
					break;
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
					subject: 'Pretendo Network Subscription - Active',
					text: `Thank you for purchasing the ${product.name} tier! We greatly value your support, thank you for helping keep Pretendo Network alive!\nIt may take a moment for your account dashboard to reflect these changes. Please wait a moment and refresh the dashboard to see them!`
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email}, ${pid} | - ${error.message}`);
			}
		}

		if (subscription.status === 'canceled') {
			try {
				await mailer.sendMail({
					to: customer.email,
					subject: 'Pretendo Network Subscription - Canceled',
					text: `Your subscription for the ${product.name} tier has been canceled. We thank for your previous support, and hope you still enjoy the network! `
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email}, ${pid} | - ${error.message}`);
			}
		}

		if (subscription.status === 'unpaid') {
			try {
				await mailer.sendMail({
					to: customer.email,
					subject: 'Pretendo Network Subscription - Unpaid',
					text: `Your subscription for the ${product.name} tier has been canceled due to non payment. We thank for your previous support, and hope you still enjoy the network! `
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email}, ${pid} | - ${error.message}`);
			}
		}
	}
}

module.exports = {
	fullUrl,
	getLocale,
	apiGetRequest,
	apiPostGetRequest,
	apiDeleteGetRequest,
	nintendoPasswordHash,
	handleStripeEvent
};
