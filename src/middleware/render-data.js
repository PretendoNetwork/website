const util = require('../util');

async function renderDataMiddleware(request, response, next) {
	// Get user local
	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	response.locals.locale = locale;
	response.locals.localeString = reqLocale.toString();

	// Get message cookies
	response.locals.success_message = request.cookies.success_message;
	response.locals.error_message = request.cookies.error_message;

	// Reset message cookies
	response.clearCookie('success_message', { domain: '.pretendo.network' });
	response.clearCookie('error_message', { domain: '.pretendo.network' });
	
	return next();
}

module.exports = renderDataMiddleware;