async function redirectMiddleware(request, response, next) {
	if (request.path.startsWith('/account/logout')) {
		return next();
	}
	
	if (request.method === 'POST') {
		request.redirect = request.body.redirect?.startsWith('/') ? request.body.redirect : null;
	}

	if (request.query.redirect) {
		response.locals.redirect = request.query.redirect?.startsWith('/') ? request.query.redirect : null;
	}

	return next();
}

module.exports = redirectMiddleware;
