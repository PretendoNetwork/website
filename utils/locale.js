import fs from 'fs-extra';
import merge from 'lodash.merge';
import logger from './logger.js';

import baseLocale from '../locales/en_US.json' assert {type: 'json'};

function getLocale(code) {
	const localeCode = code.replace('-', '_');
	const path = `./locales/${localeCode}.json`;

	if (fs.pathExistsSync(path)) {
		const selectedLocale = JSON.parse(fs.readFileSync(path, 'utf8'));
		const finalLocale = merge({}, baseLocale, selectedLocale);

		return finalLocale;
	} else {
		logger.warn(`Could not find locale ${localeCode}! Loading en_US`);
		return baseLocale;
	}
};

function getLocaleList() {
	const filenames = fs.readdirSync('./locales').map((filename) =>	filename.replace('.json', '').replace('_', '-'));
	return filenames;
}

export { getLocale, getLocaleList };
