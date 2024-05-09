const util = require('../util');
const database = require('../database');
const fs = require('fs');
const localeFileNames = fs.readdirSync(`${__dirname}/../../locales`);

async function renderDataMiddleware(request, response, next) {
	if (request.path.startsWith('/assets')) {
		return next();
	}

	if (request.path.startsWith('/account/logout')) {
		return next();
	}

	// Get user locale
	const reqLocale = request.cookies.preferredLocale || request.locale.toString();
	const locale = util.getLocale(reqLocale);

	let localeList = localeFileNames.map(locale => {
		const code = locale.replace('.json', '').replace('_', '-');

		// Check if it's a real language code, or a custom one
		if (!code.includes('@')) {
			const enDisp = new Intl.DisplayNames([code], {
				type: 'language',
				languageDisplay: 'standard'
			});
			const languageName = enDisp.of(code);

			return {
				code,
				languageName
			};
		} else {
			switch (code) {
				case 'en@uwu':
					return {
						code,
						languageName: 'English (lolcat)'
					};

				default:
					return {
						code,
						languageName: 'Unknown'
					};
			}
		}
	});

	// sort the array alphabetically by languageName while making sure that objects with language codes starting with 'en' are at the top
	localeList = localeList.sort((a, b) => {
		if (a.code.startsWith('en') && !b.code.startsWith('en')) {
			return -1;
		} else if (!a.code.startsWith('en') && b.code.startsWith('en')) {
			return 1;
		} else {
			return a.languageName.localeCompare(b.languageName);
		}
	});

	// move all the objects with language codes containing '@' to the end of the array
	localeList = localeList.sort((a, b) => {
		if (a.code.includes('@') && !b.code.includes('@')) {
			return 1;
		} else if (!a.code.includes('@') && b.code.includes('@')) {
			return -1;
		} else {
			return 0;
		}
	});

	response.locals.localeList = localeList;

	response.locals.locale = locale;
	response.locals.localeString = reqLocale;

	// Get message cookies
	response.locals.success_message = request.cookies.success_message;
	response.locals.error_message = request.cookies.error_message;

	// Reset message cookies
	response.clearCookie('success_message', { domain: '.pretendo.network' });
	response.clearCookie('error_message', { domain: '.pretendo.network' });

	response.locals.isLoggedIn = request.cookies.access_token && request.cookies.refresh_token;

	if (response.locals.isLoggedIn) {
		try {
			response.locals.account = await util.getUserAccountData(request, response);

			request.pnid = await database.PNID.findOne({ pid: response.locals.account.pid });
			request.account = response.locals.account;

			if (request.pnid.deleted) {
				// TODO - We just need to overhaul our API tbh
				throw new Error('User not found');
			}

			return next();
		} catch (error) {
			response.cookie('error_message', error.message, { domain: '.pretendo.network' });
			return response.redirect('/account/logout');
		}
	} else {
		return next();
	}
}

module.exports = renderDataMiddleware;
