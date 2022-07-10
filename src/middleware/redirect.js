async function redirectMiddleware(request, response, next) {
	if (request.method === 'POST') {
		request.redirect = request.body.redirect?.startsWith('/') ? request.body.redirect : null;
	}

	return next();
}

module.exports = redirectMiddleware;