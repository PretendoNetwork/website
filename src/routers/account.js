const express = require('express');
const crypto = require('crypto');
const DiscordOauth2 = require('discord-oauth2');
const { v4: uuidv4 } = require('uuid');
const AdmZip = require('adm-zip');
const Stripe = require('stripe');
const database = require('../database');
const cache = require('../cache');
const util = require('../util');
const logger = require('../logger');
const config = require('../../config.json');

const { Router } = express;
const aesKey = Buffer.from(config.aes_key, 'hex');

const stripe = new Stripe(config.stripe.secret_key);
const router = new Router();

// Create OAuth client
const discordOAuth = new DiscordOauth2({
	clientId: config.discord.client_id,
	clientSecret: config.discord.client_secret,
	redirectUri: `${config.http.base_url}/account/connect/discord`,
	version: 'v9'
});

router.get('/', async (request, response) => {
	// Verify the user is logged in
	if (!request.cookies.access_token || !request.cookies.refresh_token || !request.cookies.ph) {
		return response.redirect('/account/login');
	}

	// Setup the data to be sent to the handlebars renderer
	const renderData = {
		layout: 'main',
		success: request.cookies.success,
		error: request.cookies.error
	};

	// Reset message cookies
	response.clearCookie('success', { domain: '.pretendo.network' });
	response.clearCookie('error', { domain: '.pretendo.network' });

	// Check for Stripe messages
	const { upgrade_success } = request.query;

	if (upgrade_success === 'true') {
		renderData.success = 'Account upgraded successfully';
	} else if (upgrade_success === 'false') {
		renderData.error = 'Account upgrade failed';
	}

	// Attempt to get user data
	let apiResponse = await util.apiGetRequest('/v1/user', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200) {
		// Assume expired, refresh and retry request
		apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
			refresh_token: request.cookies.refresh_token,
			grant_type: 'refresh_token'
		});

		if (apiResponse.statusCode !== 200) {
			// TODO: Error message
			return response.status(apiResponse.statusCode).json({
				error: 'Bad'
			});
		}

		const tokens = apiResponse.body;

		response.cookie('refresh_token', tokens.refresh_token, { domain : '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain : '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain : '.pretendo.network' });

		apiResponse = await util.apiGetRequest('/v1/user', {
			'Authorization': `${tokens.token_type} ${tokens.access_token}`
		});
	}

	// If still failed, something went horribly wrong
	if (apiResponse.statusCode !== 200) {
		// TODO: Error message
		return response.status(apiResponse.statusCode).json({
			error: 'Bad'
		});
	}

	// Set user account info to render data
	const account = apiResponse.body;
	const pid = account.pid;

	const pnid = await database.PNID.findOne({ pid });

	renderData.tierName = pnid.get('connections.stripe.tier_name');
	renderData.tierLevel = pnid.get('connections.stripe.tier_level');
	renderData.account = account;
	renderData.isTester = account.access_level > 0;
	renderData.isLoggedIn = request.cookies.access_token && request.cookies.refresh_token && request.cookies.ph;

	// Check if a Discord account is linked to the PNID
	if (account.connections.discord.id && account.connections.discord.id.trim() !== '') {
		// If Discord account is linked, then get user info
		try {
			renderData.discordUser = await discordOAuth.getUser(account.connections.discord.access_token);
		} catch (error) {
			// Assume expired, refresh and retry Discord request
			let tokens;
			try {
				tokens = await discordOAuth.tokenRequest({
					scope: 'identify guilds',
					grantType: 'refresh_token',
					refreshToken: account.connections.discord.refresh_token,
				});
			} catch (error) {
				renderData.error = 'Invalid Discord refresh token. Remove account and relink';
				return response.render('account/account', renderData);
			}

			// TODO: Add a dedicated endpoint for updating connections?
			apiResponse = await util.apiPostGetRequest('/v1/connections/add/discord', {
				'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
			}, {
				data: {
					id: account.connections.discord.id,
					access_token: tokens.access_token,
					refresh_token: tokens.refresh_token,
				}
			});

			if (apiResponse.statusCode !== 200) {
				// Assume expired, refresh and retry request
				apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
					refresh_token: request.cookies.refresh_token,
					grant_type: 'refresh_token'
				});

				if (apiResponse.statusCode !== 200) {
					// TODO: Error message
					return response.status(apiResponse.statusCode).json({
						error: 'Bad'
					});
				}

				const tokens = apiResponse.body;

				response.cookie('refresh_token', tokens.refresh_token, { domain : '.pretendo.network' });
				response.cookie('access_token', tokens.access_token, { domain : '.pretendo.network' });
				response.cookie('token_type', tokens.token_type, { domain : '.pretendo.network' });

				apiResponse = await util.apiPostGetRequest('/v1/connections/add/discord', {
					'Authorization': `${tokens.token_type} ${tokens.access_token}`
				}, {
					data: {
						id: account.connections.discord.id,
						access_token: tokens.access_token,
						refresh_token: tokens.refresh_token,
					}
				});

				// If still failed, something went horribly wrong
				if (apiResponse.statusCode !== 200) {
					// TODO: Error message
					return response.status(apiResponse.statusCode).json({
						error: 'Bad'
					});
				}
			}

			account.connections.discord.access_token = tokens.access_token;
			account.connections.discord.refresh_token = tokens.refresh_token;
		}

		// Get the users Discord roles to check if they are a tester
		const { roles } = await discordOAuth.getMemberRolesForGuild({
			userId: account.connections.discord.id,
			guildId: config.discord.guild_id,
			botToken: config.discord.bot_token
		});

		// Only run this check if not already a tester (edge case)
		if (!renderData.isTester) {
			// 409116477212459008 = Developer
			// 882247322933801030 = Super Mario (Patreon tier)
			renderData.isTester = roles.some(role => config.discord.tester_roles.includes(role));
		}
	} else {
		// If no Discord account linked, generate an auth URL
		const discordAuthURL = discordOAuth.generateAuthUrl({
			scope: ['identify', 'guilds'],
			state: crypto.randomBytes(16).toString('hex'),
		});
		
		renderData.discordAuthURL = discordAuthURL;
	}

	renderData.isLoggedIn = request.cookies.access_token && request.cookies.refresh_token && request.cookies.ph;

	response.render('account/account', renderData);
});

router.get('/login', async (request, response) => {
	const renderData = {
		layout: 'main',
		error: request.cookies.error
	};

	response.clearCookie('error', { domain: '.pretendo.network' });

	response.render('account/login', renderData);
});

router.post('/login', async (request, response) => {
	const { username, password } = request.body;

	let apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
		username,
		password,
		grant_type: 'password'
	});

	if (apiResponse.statusCode !== 200) {
		response.cookie('error', apiResponse.body.error, { domain: '.pretendo.network' });
		return response.redirect('/account/login');
	}

	const tokens = apiResponse.body;

	response.cookie('refresh_token', tokens.refresh_token, { domain : '.pretendo.network' });
	response.cookie('access_token', tokens.access_token, { domain : '.pretendo.network' });
	response.cookie('token_type', tokens.token_type, { domain : '.pretendo.network' });

	apiResponse = await util.apiGetRequest('/v1/user', {
		'Authorization': `${tokens.token_type} ${tokens.access_token}`
	});

	const account = apiResponse.body;

	const hashedPassword = util.nintendoPasswordHash(password, account.pid);
	const hashedPasswordBuffer = Buffer.from(hashedPassword, 'hex');

	const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, Buffer.alloc(16));

	let encryptedBody = cipher.update(hashedPasswordBuffer);
	encryptedBody = Buffer.concat([encryptedBody, cipher.final()]);

	response.cookie('ph', encryptedBody.toString('hex'), { domain: '.pretendo.network' });

	response.redirect(request.redirect || '/account');
});

router.get('/register', async (request, response) => {
	const renderData = {
		layout: 'main',
		error: request.cookies.error,
		email: request.cookies.email,
		username: request.cookies.username,
		mii_name: request.cookies.mii_name,
	};

	response.clearCookie('error', { domain: '.pretendo.network' });
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

	const apiResponse = await util.apiPostGetRequest('/v1/register', {}, {
		email, username, mii_name, password, password_confirm, hCaptchaResponse
	});

	if (apiResponse.statusCode !== 200) {
		response.cookie('error', apiResponse.body.error, { domain: '.pretendo.network' });
		return response.redirect('/account/register');
	}

	const tokens = apiResponse.body;

	response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
	response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
	response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

	response.clearCookie('error', { domain: '.pretendo.network' });
	response.clearCookie('email', { domain: '.pretendo.network' });
	response.clearCookie('username', { domain: '.pretendo.network' });
	response.clearCookie('mii_name', { domain: '.pretendo.network' });

	response.redirect(request.redirect || '/account');
});

router.get('/logout', async(_request, response) => {
	response.clearCookie('refresh_token', { domain: '.pretendo.network' });
	response.clearCookie('access_token', { domain: '.pretendo.network' });
	response.clearCookie('token_type', { domain: '.pretendo.network' });
	response.clearCookie('ph', { domain: '.pretendo.network' });

	response.redirect('/');
});

router.get('/connect/discord', async (request, response) => {
	let tokens;
	try {
		// Attempt to get OAuth2 tokens
		tokens = await discordOAuth.tokenRequest({
			code: request.query.code,
			scope: 'identify guilds',
			grantType: 'authorization_code',
		});
	} catch (error) {
		response.cookie('error', 'Invalid Discord authorization code. Please try again', { domain: '.pretendo.network' });
		return response.redirect('/account');
	}

	// Get Discord user data
	const user = await discordOAuth.getUser(tokens.access_token);

	// Link the Discord account to the PNID
	let apiResponse = await util.apiPostGetRequest('/v1/connections/add/discord', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	}, {
		data: {
			id: user.id,
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
		}
	});

	if (apiResponse.statusCode !== 200) {
		// Assume expired, refresh and retry request
		apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
			refresh_token: request.cookies.refresh_token,
			grant_type: 'refresh_token'
		});

		if (apiResponse.statusCode !== 200) {
			// TODO: Error message
			return response.status(apiResponse.statusCode).json({
				error: 'Bad'
			});
		}

		const tokens = apiResponse.body;

		response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

		apiResponse = await util.apiPostGetRequest('/v1/connections/add/discord', {
			'Authorization': `${tokens.token_type} ${tokens.access_token}`
		}, {
			data: {
				id: user.id,
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
			}
		});

		// If still failed, something went horribly wrong
		if (apiResponse.statusCode !== 200) {
			// TODO: Error message
			return response.status(apiResponse.statusCode).json({
				error: 'Bad'
			});
		}
	}

	response.cookie('success', 'Discord account linked successfully', { domain: '.pretendo.network' }).redirect('/account');
});

router.get('/online-files', async (request, response) => {

	// Verify the user is logged in
	if (!request.cookies.access_token || !request.cookies.refresh_token|| !request.cookies.ph) {
		return response.redirect('/account/login?redirect=/online-files');
	}

	// Attempt to get user data
	let apiResponse = await util.apiGetRequest('/v1/user', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200) {
		// Assume expired, refresh and retry request
		apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
			refresh_token: request.cookies.refresh_token,
			grant_type: 'refresh_token'
		});

		if (apiResponse.statusCode !== 200) {
			// TODO: Error message
			return response.status(apiResponse.statusCode).json({
				error: 'Bad'
			});
		}

		const tokens = apiResponse.body;

		response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

		apiResponse = await util.apiGetRequest('/v1/user', {
			'Authorization': `${tokens.token_type} ${tokens.access_token}`
		});
	}

	// If still failed, something went horribly wrong
	if (apiResponse.statusCode !== 200) {
		// TODO: Error message
		return response.status(apiResponse.statusCode).json({
			error: 'Bad'
		});
	}

	const account = apiResponse.body;

	const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.alloc(16));

	let decryptedPasswordHash = decipher.update(Buffer.from(request.cookies.ph, 'hex'));
	decryptedPasswordHash = Buffer.concat([decryptedPasswordHash, decipher.final()]);

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
	accountDat += `AccountPasswordCache=${decryptedPasswordHash.toString('hex')}`;

	const onlineFiles = new AdmZip();

	onlineFiles.addFile('mlc01/usr/save/system/act/80000001/account.dat', Buffer.from(accountDat)); // Minimal account.dat
	onlineFiles.addFile('otp.bin', Buffer.alloc(0x400)); // nulled OTP
	onlineFiles.addFile('seeprom.bin', Buffer.alloc(0x200)); // nulled SEEPROM

	response.status(200);
	response.set('Content-Disposition', 'attachment; filename="Online Files.zip');
	response.set('Content-Type', 'application/zip');

	response.end(onlineFiles.toBuffer());
});

router.get('/miieditor', async (request, response) => {
	// Should obviously be the user's
	const encodedUserMiiData = 'AwAAQOlVognnx0GC2X0LLQOzuI0n2QAAAUBiAGUAbABsAGEAAABFAAAAAAAAAEBAEgCBAQRoQxggNEYUgRIXaA0AACkDUkhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP6G';

	// Adapted from https://www.3dbrew.org/wiki/Mii#Mapped_Editor_.3C-.3E_Hex_values

	const editorToHex = {
		'face': [
			0x00,0x01,0x08,0x02,0x03,0x09,0x04,0x05,0x0a,0x06,0x07,0x0b
		],
		'hairs': [
			[0x21,0x2f,0x28,0x25,0x20,0x6b,0x30,0x33,0x37,0x46,0x2c,0x42],
			[0x34,0x32,0x26,0x31,0x2b,0x1f,0x38,0x44,0x3e,0x73,0x4c,0x77],
			[0x40,0x51,0x74,0x79,0x16,0x3a,0x3c,0x57,0x7d,0x75,0x49,0x4b],
			[0x2a,0x59,0x39,0x36,0x50,0x22,0x17,0x56,0x58,0x76,0x27,0x24],
			[0x2d,0x43,0x3b,0x41,0x29,0x1e,0x0c,0x10,0x0a,0x52,0x80,0x81],
			[0x0e,0x5f,0x69,0x64,0x06,0x14,0x5d,0x66,0x1b,0x04,0x11,0x6e],
			[0x7b,0x08,0x6a,0x48,0x03,0x15,0x00,0x62,0x3f,0x5a,0x0b,0x78],
			[0x05,0x4a,0x6c,0x5e,0x7c,0x19,0x63,0x45,0x23,0x0d,0x7a,0x71],
			[0x35,0x18,0x55,0x53,0x47,0x83,0x60,0x65,0x1d,0x07,0x0f,0x70],
			[0x4f,0x01,0x6d,0x7f,0x5b,0x1a,0x3d,0x67,0x02,0x4d,0x12,0x5c],
			[0x54,0x09,0x13,0x82,0x61,0x68,0x2e,0x4e,0x1c,0x72,0x7e,0x6f]
		],
		'eyebrows': [
			[0x06,0x00,0x0c,0x01,0x09,0x13,0x07,0x15,0x08,0x11,0x05,0x04],
			[0x0b,0x0a,0x02,0x03,0x0e,0x14,0x0f,0x0d,0x16,0x12,0x10,0x17]
		],
		'eyes': [
			[0x02,0x04,0x00,0x08,0x27,0x11,0x01,0x1a,0x10,0x0f,0x1b,0x14],
			[0x21,0x0b,0x13,0x20,0x09,0x0c,0x17,0x22,0x15,0x19,0x28,0x23],
			[0x05,0x29,0x0d,0x24,0x25,0x06,0x18,0x1e,0x1f,0x12,0x1c,0x2e],
			[0x07,0x2c,0x26,0x2a,0x2d,0x1d,0x03,0x2b,0x16,0x0a,0x0e,0x2f],
			[0x30,0x31,0x32,0x35,0x3b,0x38,0x36,0x3a,0x39,0x37,0x33,0x34]
		],
		'nose': [
			[0x01,0x0a,0x02,0x03,0x06,0x00,	0x05,0x04,0x08,0x09,0x07,0x0B],
			[0x0d,0x0e,0x0c,0x11,0x10,0x0f]
		],
		'mouth': [
			[0x17,0x01,0x13,0x15,0x16,0x05,0x00,0x08,0x0a,0x10,0x06,0x0d],
			[0x07,0x09,0x02,0x11,0x03,0x04,0x0f,0x0b,0x14,0x12,0x0e,0x0c],
			[0x1b,0x1e,0x18,0x19,0x1d,0x1c,0x1a,0x23,0x1f,0x22,0x21,0x20]
		]
	};

	response.render('account/miieditor', {
		layout: 'main',
		encodedUserMiiData,
		editorToHex
	});
});

router.get('/upgrade', async (request, response) => {
	// Verify the user is logged in
	if (!request.cookies.access_token || !request.cookies.refresh_token || !request.cookies.ph) {
		return response.redirect('/account/login?redirect=/account/upgrade');
	}

	// Attempt to get user data
	let apiResponse = await util.apiGetRequest('/v1/user', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200) {
		// Assume expired, refresh and retry request
		apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
			refresh_token: request.cookies.refresh_token,
			grant_type: 'refresh_token'
		});

		if (apiResponse.statusCode !== 200) {
			return response.redirect('/account/login');
		}

		const tokens = apiResponse.body;

		response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

		apiResponse = await util.apiGetRequest('/v1/user', {
			'Authorization': `${tokens.token_type} ${tokens.access_token}`
		});
	}

	// If still failed, something went horribly wrong
	if (apiResponse.statusCode !== 200) {
		return response.redirect('/account/login');
	}

	// Set user account info to render data
	const account = apiResponse.body;
	const pid = account.pid;

	const pnid = await database.PNID.findOne({ pid });

	const renderData = {
		layout: 'main',
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
			const price = prices.find(price => price.product === product.id);
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

router.post('/stripe/checkout/:priceId', async (request, response) => {
	// Verify the user is logged in
	if (!request.cookies.access_token || !request.cookies.refresh_token || !request.cookies.ph) {
		return response.redirect('/account/login');
	}

	// Attempt to get user data
	let apiResponse = await util.apiGetRequest('/v1/user', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200) {
		// Assume expired, refresh and retry request
		apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
			refresh_token: request.cookies.refresh_token,
			grant_type: 'refresh_token'
		});

		if (apiResponse.statusCode !== 200) {
			return response.redirect('/account/login');
		}

		const tokens = apiResponse.body;

		response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

		apiResponse = await util.apiGetRequest('/v1/user', {
			'Authorization': `${tokens.token_type} ${tokens.access_token}`
		});
	}

	// If still failed, something went horribly wrong
	if (apiResponse.statusCode !== 200) {
		return response.redirect('/account/login');
	}

	// Set user account info to render data
	const account = apiResponse.body;
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
			'connections.stripe.customer_id': customer.id // ensure PNID always has latest customer ID
		}
	}, { upsert: true }).exec();

	const priceId = request.params.priceId;

	const pnid = await database.PNID.findOne({ pid });

	if (pnid.get('access_level') >= 2) {
		response.cookie('error', 'Staff members do not need to purchase tiers', { domain: '.pretendo.network' });
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
		response.cookie('error', error.message, { domain: '.pretendo.network' });
		return response.redirect('/account');
	}
});

router.post('/stripe/unsubscribe', async (request, response) => {
	// Verify the user is logged in
	if (!request.cookies.access_token || !request.cookies.refresh_token || !request.cookies.ph) {
		return response.redirect('/account/login');
	}

	// Attempt to get user data
	let apiResponse = await util.apiGetRequest('/v1/user', {
		'Authorization': `${request.cookies.token_type} ${request.cookies.access_token}`
	});

	if (apiResponse.statusCode !== 200) {
		// Assume expired, refresh and retry request
		apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
			refresh_token: request.cookies.refresh_token,
			grant_type: 'refresh_token'
		});

		if (apiResponse.statusCode !== 200) {
			return response.redirect('/account/login');
		}

		const tokens = apiResponse.body;

		response.cookie('refresh_token', tokens.refresh_token, { domain: '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain: '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain: '.pretendo.network' });

		apiResponse = await util.apiGetRequest('/v1/user', {
			'Authorization': `${tokens.token_type} ${tokens.access_token}`
		});
	}

	// If still failed, something went horribly wrong
	if (apiResponse.statusCode !== 200) {
		return response.redirect('/account/login');
	}

	// Set user account info to render data
	const account = apiResponse.body;
	const pid = account.pid;

	const pnid = await database.PNID.findOne({ pid });
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

			response.cookie('error', 'Error canceling subscription! Contact support if issue persists', { domain: '.pretendo.network' });
			
			return response.redirect('/account');
		}
	}

	response.cookie('success', `Unsubscribed from ${tierName}`, { domain: '.pretendo.network' });
	return response.redirect('/account');
});

router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
	const stripeSignature = request.headers['stripe-signature'];
	let event;

	try {
		event = stripe.webhooks.constructEvent(request.body, stripeSignature, config.stripe.webhook_secret);
	} catch (err) {
		return response.status(400).send(`Webhook Error: ${err.message}`);
	}

	await util.handleStripeEvent(event);

	response.json({ received: true });
});


module.exports = router;