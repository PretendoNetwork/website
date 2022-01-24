process.title = 'Pretendo - Website';

const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const expressLocale = require('express-locale');
const cookieParser = require('cookie-parser');
const logger = require('./logger');
const util = require('./util');
const config = require('../config.json');

const defaultLocale = require('../locales/US_en.json');

const { http: { port } } = config;
const app = express();

logger.info('Setting up Middleware');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

logger.info('Setting up static public folder');
app.use(express.static('public'));

logger.info('Importing page routers');
const routers = {
	home: require('./routers/home'),
	faq: require('./routers/faq'),
	docs: require('./routers/docs'),
	progress: require('./routers/progress'),
	account: require('./routers/account'),
	blog: require('./routers/blog'),
	localization: require('./routers/localization')
};

app.use(cookieParser());

// Locale express middleware setup
app.use(expressLocale({
	'priority': ['cookie', 'accept-language', 'map', 'default'],
	cookie: { name: 'preferredLocale' },
	// Map unavailable regions to available locales from the same language
	map: {
		/* TODO: map more regions to the available locales */
		en: 'en-US', 'en-GB': 'en-US', 'en-AU': 'en-US', 'en-CA': 'en-US',
		ar: 'ar-AR',
		de: 'de-DE',
		nl: 'nl-NL',
		es: 'es-ES',
		fr: 'fr-FR', 'fr-CA': 'fr-FR', 'fr-CH': 'fr-FR',
		it: 'it-IT', 'it-CH': 'it-IT',
		ja: 'ja-JP',
		ko: 'ko-KR',
		nb: 'nb-NO',
		no: 'nb-NO',
		pt: 'pt-BR',
		ro: 'ro-RO',
		ru: 'ru-RU',
		tr: 'tr-TR'
	},
	allowed: [
		'en', 'en-US', 'en-GB', 'en-AU', 'en-CA',
		'ar', 'ar-AR',
		'de', 'de-DE',
		'nl', 'nl-NL',
		'es', 'es-ES',
		'fr', 'fr-FR', 'fr-CA', 'fr-CH',
		'it', 'it-IT', 'it-CH',
		'ja', 'ja-JP',
		'ko', 'ko-KR',
		'nb', 'no', 'nb-NO',
		'pt', 'pt-BR',
		'ro', 'ro-RO',
		'ru', 'ru-RU',
		'tr', 'tr-TR',
	],
	'default': 'en-US'
}));

app.use('/', routers.home);
app.use('/faq', routers.faq);
app.use('/docs', routers.docs);
app.use('/progress', routers.progress);
app.use('/account', routers.account);
app.use('/localization', routers.localization);
app.use('/blog', routers.blog);

logger.info('Creating 404 status handler');
// This works because it is the last router created
// Meaning the request could not find a valid router
app.use((request, response, next) => {
	const fullUrl = util.fullUrl(request);
	logger.warn(`HTTP 404 at ${fullUrl}`);
	next();
});

logger.info('Setting up handlebars engine');
app.engine('handlebars', handlebars({
	helpers: {
		doFaq(value, options) {
			let htmlLeft = '';
			let htmlRight = '';
			for (const [i, v] of Object.entries(value)) {
				const appendHtml = options.fn({
					...v
				}); // Tis is an HTML string
				if (i % 2 === 0) {
					htmlLeft += appendHtml;
				} else {
					htmlRight += appendHtml;
				}
			}
			return `
			<div class="left questions-left">
				${htmlLeft}
			</div>
			<div class="right questions-right">
				${htmlRight}
			</div>
			`;
		},
		eq(value1, value2) {
			return value1 === value2;
		},
		neq(value1, value2) {
			return value1 !== value2;
		},
		localeHelper(...args) {
			let userLocaleString = args[0];

			/*
			 *	Removes the first and the last argument, and then loops through the rest to
			 *	get the string in the user's locale. If not available, it will return it in
			 *	the default locale.
			 */
			
			args.slice(1, -1).forEach(arg => {
				userLocaleString = userLocaleString?.[arg];
			});

			if (!userLocaleString) {
				let defaultLocaleString = defaultLocale;
				args.slice(1, -1).forEach(arg => {
					defaultLocaleString = defaultLocaleString?.[arg];
				});
				return defaultLocaleString;
			} else {
				return userLocaleString;
			}
		}
	}
}));
app.set('view engine', 'handlebars');

logger.info('Starting server');
app.listen(port, () => {
	logger.success(`Server listening on http://localhost:${port}`);
});
