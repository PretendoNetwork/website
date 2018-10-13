/*

admin-authentication.js -
Middleware file for authentication checking

*/

// imports
const common = require('../helpers/common');

// middleware to use if admin authentication is required
function adminAuthenticationRequired(req, res, next) {
	if (req.isAuthenticated() && req.user.role && req.user.role === 'admin') {
		return next();
	} else {
		console.log('sending auth error');
		common.sendApiAuthError(req, res);
	}
}

// middleware to use if authentication
function authenticationOptional(req, res, next) {
	return next();
}

module.exports = {
	adminAuthenticationRequired,
	authenticationOptional
};