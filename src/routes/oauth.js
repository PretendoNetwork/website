const express = require('express');
const OAuthServer = require('@node-oauth/express-oauth-server');
const NodeCache = require('node-cache');

const config = require('../../config.json');
const util = require('../util');

// * osTicket uses the authorization code grant type and requests a new
// * authorization code and access token for each sign-in
const authorizationCodeLifetime = 2 * 60;
const accessTokenLifetime = 2 * 60;
const authorizationCodeCache = new NodeCache({
	stdTTL: authorizationCodeLifetime,
	checkperiod: authorizationCodeLifetime / 2
});
const accessTokenCache = new NodeCache({
	stdTTL: accessTokenLifetime,
	checkperiod: accessTokenLifetime / 2
});

const router = new express.Router();

async function getClient(clientId, clientSecret) {
	console.log(`getClient(clientId: ${JSON.stringify(clientId, null, 2)}, clientSecret: ${JSON.stringify(clientSecret, null, 2)})`);
	if (clientId === config.osticket.oauth.client_id &&
		(!clientSecret || clientSecret === config.osticket.oauth.client_secret)) {
		return {
			id: clientId,
			redirectUris: [config.osticket.oauth.redirect_uri],
			grants: ['authorization_code']
		};
	} else {
		return null;
	}
}

async function saveAuthorizationCode(code, client, user) {
	console.log(`saveAuthorizationCode(code: ${JSON.stringify(code, null, 2)}, client: ${JSON.stringify(client, null, 2)}, user: ${JSON.stringify(user, null, 2)})`);
	const authorizationCodeData = {
		authorizationCode: code.authorizationCode,
		expiresAt: new Date(Date.now() + authorizationCodeLifetime * 1000),
		redirectUri: code.redirectUri,
		scope: code.scope,
		client: client,
		user: user
	};

	authorizationCodeCache.set(code.authorizationCode, authorizationCodeData);

	return authorizationCodeData;
}

async function getAuthorizationCode(authorizationCode) {
	console.log(`getAuthorizationCode(authorizationCode: ${JSON.stringify(authorizationCode, null, 2)})`);
	const authorizationCodeData = authorizationCodeCache.get(authorizationCode);

	if (authorizationCodeData) {
		return authorizationCodeData;
	} else {
		return null;
	}
}
async function revokeAuthorizationCode(code) {
	console.log(`revokeAuthorizationCode(code: ${JSON.stringify(code, null, 2)})`);
	const deletedKeys = authorizationCodeCache.del(code.authorizationCode);

	return deletedKeys > 0;
}

async function saveToken(token, client, user) {
	console.log(`saveToken(token: ${JSON.stringify(token, null, 2)}, client: ${JSON.stringify(client, null, 2)}, user: ${JSON.stringify(user, null, 2)})`);
	// * osTicket doesn't use refresh tokens
	const accessTokenData = {
		accessToken: token.accessToken,
		accessTokenExpiresAt: new Date(Date.now() + accessTokenLifetime * 1000),
		scope: token.scope,
		client: client,
		user: user
	};

	accessTokenCache.set(token.accessToken, accessTokenData);

	return accessTokenData;
}


async function getAccessToken(accessToken) {
	console.log(`getAccessToken(accessToken: ${JSON.stringify(accessToken, null, 2)})`);
	const accessTokenData = accessTokenCache.get(accessToken);

	if (accessTokenData) {
		return accessTokenData;
	} else {
		return null;
	}
}

async function handleAuthentication(request, response) {
	console.log('handleAuthentication(request, response)');
	if (request.cookies.access_token && request.cookies.refresh_token) {
		try {
			const accountData = await util.getUserAccountData(request, response);

			// * Use the same fake email address as Discourse SSO for forwarding
			return {
				username: accountData.username,
				email: `${accountData.pid}@forward.local`, //TODO: Choose a domain
			};
		} catch (error) {
			console.log(error);
			response.cookie('error_message', error.message, { domain: '.pretendo.network' });
			return false;
		}
	} else {
		return false;
	}
}

const oauth = new OAuthServer({
	model: {
		getClient,
		saveAuthorizationCode,
		getAuthorizationCode,
		revokeAuthorizationCode,
		saveToken,
		getAccessToken
	}
});


router.use('/authorize', oauth.authorize({
	authenticateHandler: {
		handle: handleAuthentication
	}
}));
router.use('/token', oauth.token());
router.get('/details', oauth.authenticate(), (request, response) => {
	response.json(response.locals.oauth.token.user);
});

module.exports = router;
