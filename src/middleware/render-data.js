const util = require('../util');
const database = require('../database');

async function renderDataMiddleware(request, response, next) {
	if (request.path.startsWith('/assets')) {
		return next();
	}

	if (request.path.startsWith('/account/logout')) {
		return next();
	}

	// Get user local
	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.language, reqLocale.region);

	response.locals.locale = locale;
	response.locals.localeString = reqLocale.toString();

	// Get message cookies
	response.locals.success_message = request.cookies.success_message;
	response.locals.error_message = request.cookies.error_message;

	// Reset message cookies
	response.clearCookie('success_message', { domain: '.pretendo.network' });
	response.clearCookie('error_message', { domain: '.pretendo.network' });

	response.locals.isLoggedIn = request.cookies.access_token && request.cookies.refresh_token;

	if (response.locals.isLoggedIn) {
		try {
			response.locals.account = await util.getUserAccountData(request, response);

			request.pnid = await database.PNID.findOne({ pid: response.locals.account.pid });
			request.account = response.locals.account;

			return next();
		} catch (error) {
			response.cookie('error_message', error.message, { domain: '.pretendo.network' });
			return response.redirect('/account/logout');
		}
	} else {
		return next();
	}
}

module.exports = renderDataMiddleware;
