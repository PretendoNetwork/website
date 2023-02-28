const express = require('express');
const crypto = require('crypto');
const DiscordOauth2 = require('discord-oauth2');
const { v4: uuidv4 } = require('uuid');
const AdmZip = require('adm-zip');
const Stripe = require('stripe');
const { REST: DiscordRest } = require('@discordjs/rest');
const { Routes: DiscordRoutes } = require('discord-api-types/v10');
const requireLoginMiddleware = require('../middleware/require-login');
const database = require('../database');
const cache = require('../cache');
const util = require('../util');
const logger = require('../logger');
const config = require('../../config.json');
const editorJSON =  require('../json/miieditor.json');

const { Router } = express;

const stripe = new Stripe(config.stripe.secret_key);
const router = new Router();
const discordRest = new DiscordRest({ version: '10' }).setToken(config.discord.bot_token);

// Create OAuth client
const discordOAuth = new DiscordOauth2({
	clientId: config.discord.client_id,
	clientSecret: config.discord.client_secret,
	redirectUri: `${config.http.base_url}/account/connect/discord`,
	version: 'v10'
});

router.get('/', requireLoginMiddleware, async (request, response) => {
	// Setup the data to be sent to the handlebars renderer
	const renderData = {};

	// Check for Stripe messages
	const { upgrade_success } = request.query;

	if (upgrade_success === 'true') {
		renderData.success_message = 'Account upgraded successfully';
	} else if (upgrade_success === 'false') {
		renderData.error_message = 'Account upgrade failed';
	}

	const { account } = request;
	const { pnid } = request;

	renderData.tierName = pnid.get('connections.stripe.tier_name');
	renderData.tierLevel = pnid.get('connections.stripe.tier_level');
	renderData.account = account;
	renderData.isTester = account.access_level > 0;

	// Check if a Discord account is linked to the PNID
	if (account.connections.discord.id && account.connections.discord.id.trim() !== '') {
		try {
			renderData.discordUser = await discordRest.get(DiscordRoutes.user(account.connections.discord.id));
		} catch (error) {
			response.cookie('error_message', error.message, { domain: '.pretendo.network' });
		}
	} else {
		// If no Discord account linked, generate an auth URL
		const discordAuthURL = discordOAuth.generateAuthUrl({
			scope: ['identify', 'guilds'],
			state: crypto.randomBytes(16).toString('hex'),
		});

		renderData.discordAuthURL = discordAuthURL;
	}

	response.render('account/account', renderData);
});

router.get('/login', async (request, response) => {
	const renderData = {
		error: request.cookies.error_message
	};

	response.render('account/login', renderData);
});

router.post('/login', async (request, response) => {
	const { username, password } = request.body;

	try {
		const tokens = await util.login(username, password);

		response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

		response.redirect(request.redirect || '/account');

	} catch (error) {
		console.log(error);
		response.cookie('error_message', error.message, { domain: '.pretendo.network' });
		return response.redirect('/account/login');
	}
});

router.get('/register', async (request, response) => {
	const renderData = {
		email: request.cookies.email,
		username: request.cookies.username,
		mii_name: request.cookies.mii_name,
		error: request.cookies.error_message
	};

	response.clearCookie('email', { domain: '.pretendo.network' });
	response.clearCookie('username', { domain: '.pretendo.network' });
	response.clearCookie('mii_name', { domain: '.pretendo.network' });

	response.render('account/register', renderData);
});

router.post('/register', async (request, response) => {
	const { email, username, mii_name, password, password_confirm, 'h-captcha-response': hCaptchaResponse } = request.body;

	response.cookie('email', email, { domain: '.pretendo.network' });
	response.cookie('username', username, { domain: '.pretendo.network' });
	response.cookie('mii_name', mii_name, { domain: '.pretendo.network' });

	try {
		const tokens = await util.register({
			email,
			username,
			mii_name,
			password,
			password_confirm,
			hCaptchaResponse
		});

		response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

		response.clearCookie('email', { domain: '.pretendo.network' });
		response.clearCookie('username', { domain: '.pretendo.network' });
		response.clearCookie('mii_name', { domain: '.pretendo.network' });

		response.redirect(request.redirect || '/account');
	} catch (error) {
		response.cookie('error_message', error.message, { domain: '.pretendo.network' });
		return response.redirect('/account/register');
	}
});

router.get('/logout', async(_request, response) => {
	response.clearCookie('refresh_token', { domain: '.pretendo.network' });
	response.clearCookie('access_token', { domain: '.pretendo.network' });
	response.clearCookie('token_type', { domain: '.pretendo.network' });

	response.redirect('/');
});

router.get('/connect/discord', requireLoginMiddleware, async (request, response) => {
	const { pnid } = request;
	let tokens;
	try {
		// Attempt to get OAuth2 tokens
		tokens = await discordOAuth.tokenRequest({
			code: request.query.code,
			scope: 'identify guilds',
			grantType: 'authorization_code',
		});
	} catch (error) {
		response.cookie('error_message', 'Invalid Discord authorization code. Please try again', { domain: '.pretendo.network' });
		return response.redirect('/account');
	}

	// Get Discord user data
	const discordUser = await discordOAuth.getUser(tokens.access_token);

	try {
		await util.updateDiscordConnection(discordUser, request, response);

		const priceId = pnid.get('connections.stripe.price_id');

		if (priceId && priceId.trim() !== '') {
			const price = await stripe.prices.retrieve(priceId);
			const product = await stripe.products.retrieve(price.product);
			const discordRoleId = product.metadata.discord_role_id;
			const discordId = discordUser.id;

			await util.assignDiscordMemberSupporterRole(discordId, discordRoleId);

			if (product.metadata.beta === 'true') {
				await util.assignDiscordMemberTesterRole(discordId);
			}
		}

		response.cookie('success_message', 'Discord account linked successfully', { domain: '.pretendo.network' });
		return response.redirect('/account');
	} catch (error) {
		response.cookie('error_message', error.message, { domain: '.pretendo.network' });
		return response.redirect('/account');
	}
});

router.get('/remove/discord', requireLoginMiddleware, async (request, response) => {
	const { account, pnid } = request;

	try {
		await util.removeDiscordConnection(request, response);

		const priceId = pnid.get('connections.stripe.price_id');

		if (priceId && priceId.trim() !== '') {
			const price = await stripe.prices.retrieve(priceId);
			const product = await stripe.products.retrieve(price.product);
			const discordRoleId = product.metadata.discord_role_id;
			const discordId = account.connections.discord.id;

			await util.removeDiscordMemberSupporterRole(discordId, discordRoleId);

			if (product.metadata.beta === 'true') {
				await util.removeDiscordMemberTesterRole(discordId);
			}
		}
		
		response.cookie('success_message', 'Discord account removed successfully', { domain: '.pretendo.network' });
		return response.redirect('/account');
	} catch (error) {
		response.cookie('error_message', error.message, { domain: '.pretendo.network' });
		return response.redirect('/account');
	}
});

router.post('/online-files', requireLoginMiddleware, async (request, response) => {
	const { account } = request;
	const { password } = request.body;

	const hashedPassword = util.nintendoPasswordHash(password, account.pid);

	const miiNameBuffer = Buffer.alloc(0x16);
	const miiName = Buffer.from(account.mii.name, 'utf16le').swap16();
	miiName.copy(miiNameBuffer);

	let accountDat = 'AccountInstance_00000000\n';
	accountDat += 'PersistentId=80000001\n';
	accountDat += 'TransferableIdBase=0\n';
	accountDat += `Uuid=${uuidv4().replace(/-/g, '')}\n`;
	accountDat += `MiiData=${Buffer.from(account.mii.data, 'base64').toString('hex')}\n`;
	accountDat += `MiiName=${miiNameBuffer.toString('hex')}\n`;
	accountDat += `AccountId=${account.username}\n`;
	accountDat += 'BirthYear=0\n';
	accountDat += 'BirthMonth=0\n';
	accountDat += 'BirthDay=0\n';
	accountDat += 'Gender=0\n';
	accountDat += `EmailAddress=${account.email.address}\n`;
	accountDat += 'Country=0\n';
	accountDat += 'SimpleAddressId=0\n';
	accountDat += `PrincipalId=${account.pid.toString(16)}\n`;
	accountDat += 'IsPasswordCacheEnabled=1\n';
	accountDat += `AccountPasswordCache=${hashedPassword}`;

	const onlineFiles = new AdmZip();

	onlineFiles.addFile('mlc01/usr/save/system/act/80000001/account.dat', Buffer.from(accountDat)); // Minimal account.dat
	onlineFiles.addFile('otp.bin', Buffer.alloc(0x400)); // nulled OTP
	onlineFiles.addFile('seeprom.bin', Buffer.alloc(0x200)); // nulled SEEPROM

	response.status(200);
	response.set('Content-Disposition', 'attachment; filename="Cemu Pretendo Online Files.zip');
	response.set('Content-Type', 'application/zip');

	response.end(onlineFiles.toBuffer());
});

router.get('/miieditor', requireLoginMiddleware, async (request, response) => {
	const { account } = request;

	response.render('account/miieditor', {
		encodedUserMiiData: account.mii.data,
		editorJSON
	});
});

router.get('/upgrade', requireLoginMiddleware, async (request, response) => {
	// Set user account info to render data
	const { pnid } = request;

	const renderData = {
		error: request.cookies.error,
		currentTier: pnid.get('connections.stripe.price_id'),
		donationCache: await cache.getStripeDonationCache()
	};

	const { data: prices } = await stripe.prices.list();
	const { data: products } = await stripe.products.list();

	renderData.tiers = products
		.filter(product => product.active)
		.sort((a, b) => +a.metadata.tier_level - +b.metadata.tier_level)
		.map(product => {
			const price = prices.find(price => price.id === product.default_price);
			const perks = [];

			if (product.metadata.discord_read === 'true') {
				perks.push('Read-only access to select dev channels on Discord');
			}

			if (product.metadata.beta === 'true') {
				perks.push('Access the beta servers');
			}

			return {
				price_id: price.id,
				thumbnail: product.images[0],
				name: product.name,
				description: product.description,
				perks,
				price: (price.unit_amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
			};
		});

	response.render('account/upgrade', renderData);
});

router.post('/stripe/checkout/:priceId', requireLoginMiddleware, async (request, response) => {
	// Set user account info to render data
	const { account } = request;
	const pid = account.pid;

	let customer;
	const { data: searchResults } = await stripe.customers.search({
		query: `metadata['pnid_pid']:'${pid}'`
	});

	if (searchResults.length !== 0) {
		customer = searchResults[0];
	} else {
		customer = await stripe.customers.create({
			email: account.email.address,
			metadata: {
				pnid_pid: pid
			}
		});
	}

	await database.PNID.updateOne({ pid }, {
		$set: {
			'connections.stripe.customer_id': customer.id, // ensure PNID always has latest customer ID
			'connections.stripe.latest_webhook_timestamp': 0
		}
	}, { upsert: true }).exec();

	const priceId = request.params.priceId;

	const pnid = await database.PNID.findOne({ pid });

	if (pnid.get('access_level') >= 2) {
		response.cookie('error_message', 'Staff members do not need to purchase tiers', { domain: '.pretendo.network' });
		return response.redirect('/account');
	}

	try {
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			customer: customer.id,
			mode: 'subscription',
			success_url: `${config.http.base_url}/account?upgrade_success=true`,
			cancel_url: `${config.http.base_url}/account?upgrade_success=false`
		});

		return response.redirect(303, session.url);
	} catch (error) {
		// Maybe we need a dedicated error page?
		// Or handle this as not cookies?
		response.cookie('error_message', error.message, { domain: '.pretendo.network' });

		return response.redirect('/account');
	}
});

router.post('/stripe/unsubscribe', requireLoginMiddleware, async (request, response) => {
	// Set user account info to render data
	const { pnid } = request;

	const pid = pnid.get('pid');
	const subscriptionId = pnid.get('connections.stripe.subscription_id');
	const tierName = pnid.get('connections.stripe.tier_name');

	if (subscriptionId) {
		try {
			await stripe.subscriptions.del(subscriptionId);

			const updateData = {
				'connections.stripe.subscription_id': null,
				'connections.stripe.price_id':  null,
				'connections.stripe.tier_level': 0,
				'connections.stripe.tier_name': null,
			};

			if (pnid.get('access_level') < 2) {
				// Fail-safe for if staff members reach here
				// Mostly only useful during testing
				updateData.access_level = 0;
			}

			await database.PNID.updateOne({ pid }, { $set: updateData }).exec();
		} catch (error) {
			logger.error(`Error canceling old user subscription | ${pnid.get('connections.stripe.customer_id')}, ${pid}, ${subscriptionId} | - ${error.message}`);

			response.cookie('error_message', 'Error canceling subscription! Contact support if issue persists', { domain: '.pretendo.network' });

			return response.redirect('/account');
		}
	}

	response.cookie('success', `Unsubscribed from ${tierName}`, { domain: '.pretendo.network' });
	return response.redirect('/account');
});

router.post('/stripe/webhook', async (request, response) => {
	const stripeSignature = request.headers['stripe-signature'];
	let event;

	try {
		event = stripe.webhooks.constructEvent(request.rawBody, stripeSignature, config.stripe.webhook_secret);
	} catch (error) {
		logger.error(error.message);
		return response.status(400).send(`Webhook Error: ${error.message}`);
	}

	await util.handleStripeEvent(event);

	response.json({ received: true });
});


module.exports = router;
