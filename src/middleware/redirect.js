const config = require('../config');

function isValidRedirect(redirect) {
	if (!redirect) return false;
	if (redirect.startsWith('/')) return true;
	if (redirect.startsWith('http://') || redirect.startsWith('https://')) {
		try {
			const url = new URL(redirect);
			return config.http.valid_redirection_domains.some(domain => url.hostname.endsWith(domain));
		} catch (ignored) {
			return false;
		}
	}

	return false;
}

async function redirectMiddleware(request, response, next) {
	if (request.path.startsWith('/account/logout')) {
		return next();
	}

	if (request.method === 'POST' && request.body) {
		request.redirect = isValidRedirect(request.body.redirect) ? request.body.redirect : null;
	}

	if (request.query.redirect) {
		response.locals.redirect = isValidRedirect(request.query.redirect) ? request.query.redirect : null;
	}

	return next();
}

module.exports = redirectMiddleware;
