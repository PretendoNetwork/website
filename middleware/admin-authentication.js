const common = require('../helpers/common');

function adminUserAuthenticationMiddleware(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	common.sendApiAuthError(req, res);
}

module.exports = adminUserAuthenticationMiddleware;