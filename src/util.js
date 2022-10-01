const path = require('path');
const fs = require('fs-extra');
const got = require('got');
const crypto = require('crypto');
const Stripe = require('stripe');
const { marked } = require('marked');
const { REST: DiscordRest } = require('@discordjs/rest');
const { Routes: DiscordRoutes } = require('discord-api-types/v10');
const merge = require('lodash.merge');

const mailer = require('./mailer');
const database = require('./database');
const logger = require('./logger');

const config = require('../config.json');
const baseLocale = require(`${__dirname}/../locales/en_US.json`);
const discordRest = new DiscordRest({ version: '10' }).setToken(config.discord.bot_token);

const stripe = new Stripe(config.stripe.secret_key);

function fullUrl(request) {
	return `${request.protocol}://${request.hostname}${request.originalUrl}`;
}

function getLocale(language, region) {
	const path = `${__dirname}/../locales/${language}_${region}.json`;

	if (fs.pathExistsSync(path)) {
		const selectedLocale = require(path);
		const finalLocale = merge({}, baseLocale, selectedLocale);

		return finalLocale;
	}

	logger.warn(`Could not find locale ${language}_${region}! Loading en_US`);

	return baseLocale;
}

function getRawDocs(locale, subpath, pageName) {

	const localePath = path.join(__dirname, '../docs', locale.replace('-', '_'), subpath, `${pageName}.md`);
	const defaultPath = path.join(__dirname, '../docs', 'en_US', subpath, `${pageName}.md`);

	if (fs.existsSync(localePath)) {
		return {
			content: parseDocs(fs.readFileSync(localePath, 'utf8')),
			MDLocale: locale,
		};
	} else if (fs.existsSync(defaultPath)) {
		return {
			content: parseDocs(fs.readFileSync(defaultPath, 'utf8')),
			MDLocale: 'en-US'
		};
	}

	return {
		content: null,
		MDLocale: null
	};
}

function parseDocs(rawDocs) {
	if (!rawDocs) {
		return null;
	}

	let markedContent = marked(rawDocs);
	markedContent = markedContent.replaceAll(/\[yt-iframe\]\(.{11}\)/g, (match) => {
		const videoIDRegex = /(?<=\[yt-iframe\]\().*(?=\))/g;
		const videoID = match.match(videoIDRegex)[0];
		return `<div class="aspectratio-fallback"><iframe src="https://www.youtube-nocookie.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
	});

	const htmlContent = marked.parse(markedContent);
	return htmlContent;
}

function apiGetRequest(path, headers) {
	return got.get(`${config.api_base}${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers
	});
}

function apiPostRequest(path, headers, json) {
	return got.post(`${config.api_base}${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

function apiDeleteRequest(path, headers, json) {
	return got.delete(`${config.api_base}${path}`, {
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

async function register(registerData) {
	const apiResponse = await apiPostRequest('/v1/register', {}, registerData);

	if (apiResponse.statusCode !== 200) {
		throw new Error(apiResponse.body.error);
	}

	return apiResponse.body;
}

async function login(username, password) {
	const apiResponse = await apiPostRequest('/v1/login', {}, {
		username,
		password,
		grant_type: 'password'
	});

	if (apiResponse.statusCode !== 200) {
		throw new Error(apiResponse.body.error);
	}

	return apiResponse.body;
}

async function refreshLogin(request, response) {
	const apiResponse = await apiPostRequest('/v1/login', {}, {
		refresh_token: request.cookies.refresh_token,
		grant_type: 'refresh_token'
	});

	if (apiResponse.statusCode !== 200) {
		// TODO: Error message
		throw new Error('Bad');
	}

	const tokens = apiResponse.body;

	response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
	response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
	response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

	request.cookies.refresh_token = tokens.refresh_token;
	request.cookies.access_token = tokens.access_token;
	request.cookies.token_type = tokens.token_type;
}

async function getUserAccountData(request, response, fromRetry=false) {
	const apiResponse = await apiGetRequest('/v1/user', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200 && fromRetry === true) {
		// TODO: Error message
		throw new Error('Bad');
	}

	if (apiResponse.statusCode !== 200) {
		await refreshLogin(request, response);
		return await getUserAccountData(request, response, true);
	}

	return apiResponse.body;
}

async function updateDiscordConnection(discordUser, request, response, fromRetry=false) {
	const apiResponse = await apiPostRequest('/v1/connections/add/discord', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	}, {
		data: {
			id: discordUser.id
		}
	});

	if (apiResponse.statusCode !== 200 && fromRetry === true) {
		// TODO: Error message
		throw new Error('Bad');
	}

	if (apiResponse.statusCode !== 200) {
		await refreshLogin(request, response);
		await updateDiscordConnection(discordUser, request, response, true);
	}
}

async function removeDiscordConnection(request, response, fromRetry = false) {
	const apiResponse = await apiDeleteRequest('/v1/connections/remove/discord', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200 && fromRetry === true) {
		// TODO: Error message
		throw new Error('Bad');
	}

	if (apiResponse.statusCode !== 200) {
		await refreshLogin(request, response);
		await removeDiscordConnection(request, response, true);
	}
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
				removeDiscordMemberTesterRole(discordId).catch(error => {
					logger.error(`Error removing user Discord tester role | ${customer.id}, ${discordId}, ${pid} | - ${error.message}`);
				});
			}

			removeDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
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
			switch (subscription.status) {
				case 'active':
					if (pnid.access_level < 2) { // only change access level if not staff member
						updateData.access_level = 1;
					}

					assignDiscordMemberTesterRole(discordId).catch(error => {
						logger.error(`Error assigning user Discord tester role | ${customer.id}, ${discordId}, ${pid} | - ${error.message}`);
					});
					break;

				case 'canceled': // Subscription was canceled
				case 'unpaid': // User missed too many payments
					if (pnid.access_level < 2) { // only change access level if not staff member
						updateData.access_level = 0;
					}

					removeDiscordMemberTesterRole(discordId).catch(error => {
						logger.error(`Error removing user Discord tester role | ${customer.id}, ${discordId}, ${pid} | - ${error.message}`);
					});
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

			assignDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
				logger.error(`Error assigning user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} | - ${error.message}`);
			});
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

			removeDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
				logger.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} | - ${error.message}`);
			});
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

			removeDiscordMemberSupporterRole(discordId, product.metadata.discord_role_id).catch(error => {
				logger.error(`Error removing user Discord supporter role | ${customer.id}, ${discordId}, ${pid}, ${product.metadata.discord_role_id} | - ${error.message}`);
			});
		}
	}
}

async function assignDiscordMemberSupporterRole(memberId, roleId) {
	if (memberId && memberId.trim() !== '') {
		await discordRest.put(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, config.discord.roles.supporter));
		await discordRest.put(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, roleId));
	}
}

async function assignDiscordMemberTesterRole(memberId) {
	if (memberId && memberId.trim() !== '') {
		await discordRest.put(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, config.discord.roles.tester));
	}
}

async function removeDiscordMemberSupporterRole(memberId, roleId) {
	if (memberId && memberId.trim() !== '') {
		await discordRest.delete(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, config.discord.roles.supporter));
		await discordRest.delete(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, roleId));
	}
}

async function removeDiscordMemberTesterRole(memberId) {
	if (memberId && memberId.trim() !== '') {
		await discordRest.delete(DiscordRoutes.guildMemberRole(config.discord.guild_id, memberId, config.discord.roles.tester));
	}
}

module.exports = {
	fullUrl,
	getLocale,
	getRawDocs,
	parseDocs,
	apiGetRequest,
	apiPostRequest,
	apiDeleteRequest,
	register,
	login,
	refreshLogin,
	getUserAccountData,
	updateDiscordConnection,
	removeDiscordConnection,
	nintendoPasswordHash,
	handleStripeEvent,
	assignDiscordMemberSupporterRole,
	assignDiscordMemberTesterRole,
	removeDiscordMemberSupporterRole,
	removeDiscordMemberTesterRole
};
