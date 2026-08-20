import regions from '@/assets/json/regions.json';
import timezones from '@/assets/json/timezones.json';

export function webLocaleToConsoleLocale(lo: string): 'japanese' | 'french' | 'german' | 'italian' | 'spanish' | 'korean' | 'dutch' | 'portuguese' | 'russian' | 'chinese_traditional' | 'chinese_simple' | 'english' {
	const convObj = {
		'ja': 'japanese',
		'fr': 'french',
		'de': 'german',
		'it': 'italian',
		'es': 'spanish',
		'ko': 'korean',
		'nl': 'dutch',
		'pt': 'portuguese',
		'ru': 'russian',
		'zh-Hant': 'chinese_traditional',
		'zh-Hans': 'chinese_simple'
	};

	const l = lo.split('-');

	return convObj[l[0]] || convObj[lo] || 'english';
}

export function webLocaleToTimezoneLocale(lo: string) {
	const l = lo.split('-');

	switch (l[0]) {
		case 'ja':
		case 'fr':
		case 'de':
		case 'it':
		case 'es':
		case 'nl':
		case 'pt':
		case 'ru': {
			return l[0];
		}
		default: {
			return 'en';
		}
	}
}

export function regionIdToCountryObject(region: number) {
	const countryId = (region >>> 24) & 0xFF;
	return regions.find(r => r.id === countryId);
}

export function regionIdToObject(region: number) {
	return regions.flatMap(c => c.regions).find(r => r.id === region);
}

export function regionIdToLocalizedNames(localeCode: string, region: number | undefined) {
	if (!localeCode || !region) {
		return;
	}

	const l = webLocaleToConsoleLocale(localeCode);

	const lCountryName = regionIdToCountryObject(region)?.translations[l];
	const lRegionName = regionIdToObject(region)?.translations[l];

	return {
		country: lCountryName,
		region: lRegionName
	};
}

export function getLocalizedRegionTimezones(localeCode: string, region: number | undefined) {
	if (!localeCode || !region) {
		return;
	}

	const country = regionIdToCountryObject(region);
	const l = webLocaleToTimezoneLocale(localeCode);

	const countryTimezones = timezones[country.iso_code];

	return countryTimezones[l] || countryTimezones.en || countryTimezones.ja;
}

export function getLocalizedTimezoneString(localeCode: string | undefined, region: number | undefined, timezone: string | undefined) {
	if (!localeCode || !region || !timezone) {
		return;
	}

	const tList = getLocalizedRegionTimezones(localeCode, region);

	let localizedTz = '';

	const tzObj = tList.find((v) => {
		return (v.area === timezone);
	});

	if (tzObj) {
		localizedTz = `${timezone?.replaceAll('_', ' ')} - ${tzObj.name}`;
	}

	return localizedTz;
}

export function getLocalizedCountryList(localeCode: string) {
	const l = webLocaleToConsoleLocale(localeCode);

	const lCountryList: {
		code: string;
		id: number;
		name: string;
	}[] = [];

	regions.forEach(
		(r) => {
			lCountryList.push({
				code: r.iso_code,
				id: r.id,
				name: r.translations[l] || r.translations.english || r.name || r.translations.japanese
			});
		}
	);

	lCountryList.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});

	return lCountryList;
}

export function getLocalizedRegionList(localeCode: string, region: number | undefined) {
	if (!localeCode || !region) {
		return;
	}

	const l = webLocaleToConsoleLocale(localeCode);
	const c = regionIdToCountryObject(region);

	const lRegionList: {
		id: number;
		name: string;
	}[] = [];

	c?.regions.forEach(
		(r) => {
			lRegionList.push({
				id: r.id,
				name: r.translations[l] || r.translations.english || r.name || r.translations.japanese
			});
		}
	);

	lRegionList.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});

	return lRegionList;
}
