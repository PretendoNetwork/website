/*

util.js -
small commonly used utilities

*/

const fs = require('fs-extra');

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

// Returns a list of possible locales:
/* 
*	 [
*		{
*			region: 'US',
*			language: 'en',
*			display: 'American English',
*			flag_id: 1 // I dunno maybe we display a local list that also displays flags?
*		}
*	]
*
*/
function getLocales() {
	return [];
}

// Returns a locale
function getLocale(region, language) {
	const path = `${__dirname}/../locales/${region}_${language}.json`;

	if (fs.pathExistsSync(path)) {
		return require(path);
	}

	console.warn(`Could not find locale ${region}_${language}! Loading default`);

	return getDefaultLocale();
}

// Returns the default locale
function getDefaultLocale(locale='default') {
	return require(`${__dirname}/../locales/${locale}.json`);
}

module.exports = {
	send404,
	templateReadyUser,
	getLocales,
	getLocale,
	getDefaultLocale
};