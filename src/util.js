const fs = require('fs-extra');
const got = require('got');
const crypto = require('crypto');
const gmail = require('gmail-send');
const Stripe = require('stripe');
const database = require('./database');
const logger = require('./logger');
const config = require('../config.json');

const stripe = new Stripe(config.stripe.secret_key);
const sendGmail = gmail(config.gmail);

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

		if (!customer.metadata.pnid_pid && subscription.status !== 'canceled' && subscription.status !== 'unpaid') {
			// No PNID PID linked to customer. Abort and refund!
			logger.error(`Stripe user ${customer.id} has no PNID linked! Refunding order`);

			await stripe.subscriptions.del(subscription.id);

			const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
			await stripe.refunds.create({
				payment_intent: invoice.payment_intent
			});

			try {
				await sendGmail({
					to: customer.email,
					subject: 'Pretendo Subscription Failed - No Linked PNID',
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
				await sendGmail({
					to: customer.email,
					subject: 'Pretendo Subscription Failed - PNID Not Found',
					text: `Your recent subscription to Pretendo Network has failed.\nThis is due to the provided PNID not being found. The subscription has been canceled and refunded. Please contact Jon immediately.\nStripe Customer ID: ${customer.id}\nPNID PID: ${pid}`
				});
			} catch (error) {
				logger.error(`Error sending email | ${customer.id}, ${customer.email} | - ${error.message}`);
			}
			
			return;
		}

		const updateData = {
			connections: {
				stripe: {
					price_id: subscription.plan.id,
					tier_level: Number(product.metadata.tier_level || 0),
					latest_webhook_timestamp: event.created
				}
			}
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

			await database.PNID.updateOne({ pid }, { $set: updateData }, { upsert: true }).exec();
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