/*

util.js -
small commonly used utilities

*/

const fs = require('fs-extra');
const logger = require('../logger');

const setLocales = (request)=> {
	return request.headers['accept-language'].split('-')[0].toUpperCase();
};
// Returns a locale
function getLocale(request) {
	const locale = setLocales(request);
	const path = `${__dirname}/../locales/${locale}.json`;

	if (fs.pathExistsSync(path)) {
		return require(path);
	}

	logger.warn(`Could not find locale ${locale}! Loading default`);

	return getDefaultLocale();
}

// Returns the default locale
function getDefaultLocale(locale='default') {
	return require(`${__dirname}/../locales/${locale}.json`);
}

module.exports = {
	getLocale,
	getDefaultLocale,
	setLocales
};