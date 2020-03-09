/*

util.js -
small commonly used utilities

*/

const fs = require('fs-extra');
const logger = require('../logger');

// Returns a locale
function getLocale(region, language) {
	const path = `${__dirname}/../locales/${region}_${language}.json`;

	if (fs.pathExistsSync(path)) {
		return require(path);
	}

	logger.warn(`Could not find locale ${region}_${language}! Loading default`);

	return getDefaultLocale();
}

// Returns the default locale
function getDefaultLocale(locale='default') {
	return require(`${__dirname}/../locales/${locale}.json`);
}

module.exports = {
	getLocale,
	getDefaultLocale
};