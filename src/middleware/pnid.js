const util = require('../util');
const database = require('../database');

async function pnidMiddleware(request, response, next) {
	// Verify the user is logged in
	if (!request.cookies.access_token || !request.cookies.refresh_token || !request.cookies.ph) {
		return response.redirect(`/account/login?redirect=${request.originalUrl}`);
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

	request.account = apiResponse.body;
	request.pnid = await database.PNID.findOne({ pid: request.account.pid });

	return next();
}

module.exports = pnidMiddleware;