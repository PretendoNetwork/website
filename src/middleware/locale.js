const util = require('../util');

async function localeMiddleware(request, response, next) {
	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	response.locals.locale = locale;
	response.locals.localeString = reqLocale.toString();

	return next();
}

module.exports = localeMiddleware;