/*

util.js -
small commonly used utilities

*/

const fs = require('fs-extra');
const logger = require('winston');

// shows 404 template. takes express response object
function send404(res) {
	res.status(404).render('404');
}

function templateReadyUser(req) {
	// normal user logged in
	const isLoggedIn = req.user ? req.user.role != 'admin' : false;
	const user = req.user ? req.user.toObject() : undefined;
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

	logger.log('warn', `Could not find locale ${region}_${language}! Loading default`);

	return getDefaultLocale();
}

// Returns the default locale
function getDefaultLocale(locale='default') {
	return require(`${__dirname}/../locales/${locale}.json`);
}

function generateRandomInt(length = 4) {
	return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
}

module.exports = {
	send404,
	templateReadyUser,
	getLocales,
	getLocale,
	getDefaultLocale,
	generateRandomInt
};