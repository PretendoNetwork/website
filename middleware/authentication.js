/*

admin-authentication.js -
Middleware file for authentication checking

*/

// imports
const apiHelper = require('../helpers/api');

// middleware to use if admin authentication is required
function adminAuthNeeded(req, res, next) {
	if (req.isAuthenticated() && req.user.role && req.user.role === 'admin') {
		return next();
	} else {
		apiHelper.sendApiAuthError(res);
	}
}

// middleware to use if pnid authentication is required
function pnidAuthNeeded(req, res, next) {
	if (req.isAuthenticated() && !req.user.role) {
		return next();
	} else {
		apiHelper.sendApiAuthError(res);
	}
}

// middleware to use if authentication is optional
function authOptional(req, res, next) {
	return next();
}

module.exports = {
	adminAuthNeeded,
	pnidAuthNeeded,
	authOptional
};