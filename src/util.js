const fs = require('fs-extra');
const got = require('got');
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

function apiGetRequest(path, headers) {
	return got.get(`https://api.pretendo.cc${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers
	});
}

function apiPostGetRequest(path, headers, json) {
	return got.post(`https://api.pretendo.cc${path}`, {
		responseType: 'json',
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

function apiDeleteGetRequest(path, headers, json) {
	return got.delete(`https://api.pretendo.cc${path}`, {
		throwHttpErrors: false,
		https: {
			rejectUnauthorized: false, // Needed for self-signed certificates on localhost testing
		},
		headers,
		json
	});
}

module.exports = {
	fullUrl,
	getLocale,
	apiGetRequest,
	apiPostGetRequest,
	apiDeleteGetRequest
};