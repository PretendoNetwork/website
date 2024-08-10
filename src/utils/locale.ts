import fs from 'fs-extra';
import merge from 'lodash.merge';
import logger from './logger.ts';

import baseLocale from '@/locales/en_US.json' assert { type: 'json' };

import { cookies } from 'next/headers';

function getLocale() {
	const cookieStore = cookies();

	const autoLocale = cookieStore.get('autoLocale')?.value;
	const preferredLocale = cookieStore.get('preferredLocale')?.value;

	const code = preferredLocale || autoLocale || 'us-EN';

	const localeCode = code.replace('-', '_');
	const path = `./locales/${localeCode}.json`;

	if (fs.pathExistsSync(path)) {
		const selectedLocale = JSON.parse(fs.readFileSync(path, 'utf8'));
		const finalLocale = merge({}, baseLocale, selectedLocale);

		return {
			locale: finalLocale,
			localeCode: localeCode,
		};
	} else {
		logger.warn(`Could not find locale ${localeCode}! Loading en_US`);
		return {
			locale: baseLocale,
			localeCode: 'en-US',
		};
	}
}

function getLocaleList() {
	let filenames: string[] = fs
		.readdirSync('locales')
		.map((filename: string) => filename.replace('.json', '').replace('_', '-'));

	// move en@uwu to end of list
	filenames = [...filenames.filter((a) => a !== 'en@uwu'), 'en@uwu'];

	const localeList = [];

	filenames.forEach((l) => {
		const el: {
			code: string;
			name: string;
		} = {
			code: l,
			name: _localeCodeToName(l),
		};

		localeList.push(el);
	});

	return localeList;
}

async function localeSetter(localeCode: string) {
	'use server';

	const cookieStore = cookies();
	cookieStore.set('preferredLocale', localeCode);
}

function _localeCodeToName(localeCode: string) {
	let name: string = '';
	try {
		const l = new Intl.DisplayNames([localeCode], {
			type: 'language',
		});

		name = l.of(localeCode);
	} catch {
		const fallbackNames = {
			'en@uwu': 'English (lolcat)',
		};

		name = fallbackNames[localeCode] || 'report to dev';
	}

	return name;
}

export { getLocale, getLocaleList, localeSetter };
