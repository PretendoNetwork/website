const common = require('../helpers/common');

function authenticationRequired(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		console.log('sending auth error');
		common.sendApiAuthError(req, res);
	}
}

function authenticationOptional(req, res, next) {
	return next();
}

module.exports = {
	authenticationRequired,
	authenticationOptional
};