const { Router } = require('express');
const crypto = require('crypto');
const DiscordOauth2 = require('discord-oauth2');
const util = require('../util');
const config = require('../../config.json');
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
	if (!request.cookies.access_token || !request.cookies.refresh_token) {
		return response.redirect('/account/login');
	}

	// Setup the data to be sent to the handlebars renderer
	const renderData = {
		layout: 'main',
		locale: util.getLocale(request.locale.region, request.locale.language),
		localeString: request.locale.toString(),
		linked: request.cookies.linked,
		error: request.cookies.error
	};

	// Reset message cookies
	response.clearCookie('linked');
	response.clearCookie('error');

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

	renderData.account = account;
	renderData.isTester = account.access_level > 0;

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
				response.render('account', renderData);
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

	response.render('account', renderData);
});

router.get('/login', async (request, response) => {
	const renderData = {
		layout: 'main',
		locale: util.getLocale(request.locale.region, request.locale.language),
		localeString: request.locale.toString(),
		error: request.cookies.error
	};

	response.clearCookie('error');

	response.render('account_login', renderData);
});

router.post('/login', async (request, response) => {
	const { username, password } = request.body;

	const apiResponse = await util.apiPostGetRequest('/v1/login', {}, {
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

	response.redirect('/account');
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

		response.cookie('refresh_token', tokens.refresh_token, { domain : '.pretendo.network' });
		response.cookie('access_token', tokens.access_token, { domain : '.pretendo.network' });
		response.cookie('token_type', tokens.token_type, { domain : '.pretendo.network' });

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

	response.cookie('linked', 'Discord', { domain: '.pretendo.network' }).redirect('/account');
});

module.exports = router;