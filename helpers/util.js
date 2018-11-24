/*

util.js -
small commonly used utilities

*/

// shows 404 template. takes express response object
function send404(res) {
	res.status(404).send('404');
}

function templateReadyUser(req) {
	// normal user logged in
	const isLoggedIn = req.user ? req.user.role != 'admin' : false;
	const user = req.user;
	return {
		isLoggedIn,
		user
	};
}

function getLocales() {
	return require('../locales/US_en.json');
}

module.exports = {
	send404,
	templateReadyUser,
	getLocales
};