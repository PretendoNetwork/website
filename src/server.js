process.title = 'Pretendo - Website';

const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const expressLocale = require('express-locale');
const cookieParser = require('cookie-parser');
const Stripe = require('stripe');
const redirectMiddleware = require('./middleware/redirect');
const renderDataMiddleware = require('./middleware/render-data');
const database = require('./database');
const util = require('./util');
const logger = require('./logger');
const config = require('../config.json');

const { http: { port } } = config;
const app = express();
const stripe = new Stripe(config.stripe.secret_key);

logger.info('Setting up Middleware');
app.use(morgan('dev'));
//app.use(express.json());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(expressLocale({
	'priority': ['cookie', 'accept-language', 'map', 'default'],
	cookie: { name: 'preferredLocale' },
	// Map unavailable regions to available locales from the same language
	map: {
		/* TODO: map more regions to the available locales */
		en: 'en-US', 'en-GB': 'en-US', 'en-AU': 'en-US', 'en-CA': 'en-US',
		ar: 'ar-AR',
		cn: 'zh-CN',
		de: 'de-DE',
		nl: 'nl-NL',
		es: 'es-ES',
		fr: 'fr-FR', 'fr-CA': 'fr-FR', 'fr-CH': 'fr-FR',
		it: 'it-IT', 'it-CH': 'it-IT',
		ja: 'ja-JP',
		ko: 'ko-KR',
		nb: 'nb-NO',
		no: 'nb-NO',
		pl: 'pl-PL',
		pt: 'pt-BR',
		ro: 'ro-RO',
		ru: 'ru-RU',
		uk: 'uk-UA',
	},
	allowed: [
		'en', 'en-US', 'en-GB', 'en-AU', 'en-CA',
		'ar', 'ar-AR',
		'cn', 'zh-CN', 'zh-HK', 'zh-TW',
		'de', 'de-DE',
		'nl', 'nl-NL',
		'es', 'es-ES',
		'fr', 'fr-FR', 'fr-CA', 'fr-CH',
		'it', 'it-IT', 'it-CH',
		'ja', 'ja-JP',
		'ko', 'ko-KR',
		'nb', 'no', 'nb-NO',
		'pl', 'pl-PL',
		'pt', 'pt-BR',
		'ro', 'ro-RO',
		'ru', 'ru-RU',
		'uk', 'uk-UA',
	],
	'default': 'en-US'
}));
app.use(redirectMiddleware);
app.use(renderDataMiddleware);

logger.info('Setting up static public folder');
app.use(express.static('public'));

logger.info('Importing routes');
const routes = {
	home: require('./routes/home'),
	faq: require('./routes/faq'),
	docs: require('./routes/docs'),
	progress: require('./routes/progress'),
	account: require('./routes/account'),
	blog: require('./routes/blog'),
	localization: require('./routes/localization'),
	aprilfools: require('./routes/aprilfools')
};

app.use('/', routes.home);
app.use('/faq', routes.faq);
app.use('/docs', routes.docs);
app.use('/progress', routes.progress);
app.use('/account', routes.account);
app.use('/localization', routes.localization);
app.use('/blog', routes.blog);
app.use('/nso-legacy-pack', routes.aprilfools);

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
		slug(string) {
			return string.toLowerCase().replaceAll(/ /g, '-');
		}
	}
}));
app.set('view engine', 'handlebars');

logger.info('Starting server');
database.connect().then(() => {
	app.listen(port, async () => {
		const events = await stripe.events.list({
			delivery_success: false // failed webhooks
		});

		for (const event of events.data) {
			await util.handleStripeEvent(event);
		}

		logger.success(`Server listening on http://localhost:${port}`);
	});
});
