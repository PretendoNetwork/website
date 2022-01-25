const fs = require('fs-extra');
const got = require('got');
const crypto = require('crypto');
const logger = require('./logger');

function fullUrl(request) {
	return `${request.protocol}://${request.hostname}${request.originalUrl}`;
}

function getLocale(region, language) {
	const path = `${__dirname}/../locales/${language}-${region}.json`;
	const backupFileName = getLocaleFileName(language);
	if (fs.pathExistsSync(path)) {
		return require(path);
	}
	else if (backupFileName) {
		return require(`${__dirname}/../locales/${backupFileName}`);
	}
	
	logger.warn(`Could not find locale ${language}-${region}! Loading en-US`);

	return require(`${__dirname}/../locales/en-US.json`);
}
function getLocaleFileName(language){
//Try to look if another locale with same language exist
const localeFolder = `${__dirname}/../locales/`;
const r = fs.readdirSync(localeFolder)
let i = 0
for (i;i <r.length;i++){
	var fileName = r[i]
	if (!fileName){return null}
	var fileLanguage = fileName.split("-")[0]
	if (fileLanguage.startsWith(language)){
		return fileName;
	}
}
return null;
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

function nintendoPasswordHash(password, pid) {
	const pidBuffer = Buffer.alloc(4);
	pidBuffer.writeUInt32LE(pid);

	const unpacked = Buffer.concat([
		pidBuffer,
		Buffer.from('\x02\x65\x43\x46'),
		Buffer.from(password)
	]);
	
	const hashed = crypto.createHash('sha256').update(unpacked).digest().toString('hex');

	return hashed;
}

module.exports = {
	fullUrl,
	getLocale,
	getLocaleFileName,
	apiGetRequest,
	apiPostGetRequest,
	apiDeleteGetRequest,
	nintendoPasswordHash
};