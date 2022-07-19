async function requireLoginMiddleware(request, response, next) {
	// Verify the user is logged in
	if (!request.cookies.access_token || !request.cookies.refresh_token) {
		return response.redirect(`/account/login?redirect=${request.originalUrl}`);
	}

	return next();
}

module.exports = requireLoginMiddleware;