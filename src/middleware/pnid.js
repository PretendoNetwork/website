const util = require('../util');
const database = require('../database');

async function pnidMiddleware(request, response, next) {
	// Verify the user is logged in
	if (!request.cookies.access_token || !request.cookies.refresh_token || !request.cookies.ph) {
		return response.redirect(`/account/login?redirect=${request.originalUrl}`);
	}

	try {
		request.account = await util.getUserAccountData(request, response);
		request.pnid = await database.PNID.findOne({ pid: request.account.pid });

		return next();
	} catch (error) {
		response.cookie('error_message', error.message, { domain: '.pretendo.network' });
		return response.redirect('/account/login');
	}
}

module.exports = pnidMiddleware;