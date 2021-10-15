const { Router } = require('express');
const util = require('../util');
const router = new Router();
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));
const config = require('../../config.json');

// A test PNID
const account = {
	access_level: 0, // 0: standard, 1: tester, 2: mod?, 3. dev?, 4. god
	server_access_level: 'prod', // prod, test, dev
	username: 'PN_Monty',
	password: 'thelegend27', 
	birthdate: '13/04/2004', // what format
	gender: 'what even is this', // what format
	country: 'Italy', // what format
	language: 'JS smh', // what format
	email: {
		address: 'notascam@freecreditreport.com',
		primary: true, // do we need to let the user change anything?
		parent: true,
		reachable: true,
		validated: true,
	},
	region: 'don\'t know the numbers',
	timezone: {
		name: 'Europe/Rome',
		offset: 3600, // haven't checked if this is correct, just an assumption
	},
	mii: {
		name: 'Monty',
		image_url:
      'https://studio.mii.nintendo.com/miis/image.png?data=00080f50595a606a6268696f757883969b9aa1a8b1b8b7bebdc5cccbd1d8620a121a181119111916222d3444484c4b&type=face&expression=normal&width=512',
	},
	flags: {
		marketing: true,
		off_device: true, // Forgot what this does
	},
	devices: [
		{
			is_emulator: {
				type: false,
			},
			console_type: {
				type: 'wup',
			},
			device_attributes: {
				created_date: '23/07/2021', // what format
				name: 'Wii U', // ?
				value: 'what', // what format
			},
		},
		{
			is_emulator: {
				type: false,
			},
			console_type: {
				type: 'wup',
			},
			device_attributes: {
				created_date: '24/05/2020',
				name: 'Windows', // ?
				value: 'what',
			},
		},
	],
	connections: { // This needs to be added to the schema
		discord: {
			id: '406125028065804289',
			access_token: 'GiJ2Osi6LpYS7uLgZNyvCbRtpRopv1', // This only has the identify scope so eh, who cares if it gets leaked
			expires_on: 604800,
			refresh_token: 'VeQMa6zp2Rx77PjhiNFJbpKrpz2gX2',
			scope: 'identify',
			token_type: 'Bearer',
		},
	},
};

router.get('/', async (request, response) => {
	const justLinked = request.cookies.justLinked;
	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	let discordUser;
	
	if (account.connections.discord.access_token) {
		// TODO: check if the token is valid, if not refresh it.
		const discord = account.connections.discord;
		const fetchDiscordUser = await fetch('https://discord.com/api/users/@me', {
			method: 'get',
			headers: {
				'Authorization': `${discord.token_type} ${discord.access_token}`
			},
		});
		discordUser =  await fetchDiscordUser.json();
	}

	// test user
	discordUser = {
		id: '406125028065804289',
		username: 'montylion',
		avatar: '5184b3dc388bdad1a93eb58694a58398',
		discriminator: '3581',
		public_flags: 64,
		flags: 64,
		banner: null,
		banner_color: '#ff7081',
		accent_color: 16740481,
		locale: 'en-US',
		mfa_enabled: true,
	};

	const isTester = () => {
		return account.access_level > 0;
	};

	response.clearCookie('justLinked');

	// TODO: make the sign in history only show the first 2/4 devices

	response.render('account', {
		layout: 'main',
		locale,
		localeString: reqLocale.toString(),
		account,
		isTester,
		discordUser,
		justLinked
	});
});

router.get('/connect/discord', async (request, response) => {
	//const reqLocale = request.locale;
	//const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const codeExchange = await fetch('https://discord.com/api/oauth2/token', {
		method: 'post',
		body: new URLSearchParams({
			client_id: config.discord.client_id,
			client_secret: config.discord.client_secret,
			grant_type: 'authorization_code',
			code: request.query.code,
			redirect_uri: `${config.http.base_url}/account/connect/discord`,
		}),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	});
	const token = await codeExchange.json();

	/*
	// Send the oauth tokens to the account server
	fetch('account server endpoint', {
		method: 'post',
		body: {
			access_token: token.access_token,
			token_type: token.token_type,
			expires_on: new Date().getTime() + token.expires_in,
			refresh_token: token.refresh_token,
			scope: token.scope,
		},
		headers: {
			'Content-Type': 'application/json',
		}
	});
	*/

	/* Token refresh function (should be moved to util.js)
	const refreshTokens = await fetch('https://discord.com/api/oauth2/token', {
		method: 'post',
		body: new URLSearchParams({
			client_id: config.discord.client_id,
			client_secret: config.discord.client_secret,
			grant_type: 'refresh_token',
			refresh_token: account.connections.discord.refresh_token
		}),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	});
	const newTokens = await refreshTokens.json();
	console.log(newTokens);
	*/

	// This sets a cookie to tell the account page to show the "Account linked successfully" notice, and redirects.
	response.cookie('justLinked', 'discord').redirect('/account');
});

module.exports = router;
