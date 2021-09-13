const fs = require('fs-extra');
const logger = require('./logger');

function fullUrl(request) {
	return `${request.protocol}://${request.hostname}${request.originalUrl}`;
}

function getLocale(region, language) {
	const path = `${__dirname}/../locales/${region}_${language}.json`;

	if (fs.pathExistsSync(path)) {
		return require(path);
	}

	logger.warn(`Could not find locale ${region}_${language}! Loading US_en`);

	return require(`${__dirname}/../locales/US_en.json`);
}

module.exports = {
	fullUrl,
	getLocale
};