process.on('uncaughtException', console.warn);

const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const logger = require('./logger');
const config = require('./config.json');
const utilHelper = require('./helpers/util');
require('colors');

// setup express
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

// handlebars templating setup
const hbsEngine = handlebars({
	extname: '.hbs',
	layoutsDir: 'views',
	partialsDir: 'views/partials'
});
app.engine('.hbs', hbsEngine);
app.set('view engine', '.hbs');

// locations and routes setup
const locations = {
	home: require('./routes/home'),
	connecting: require('./routes/connecting'),
	cemu: require('./routes/cemu'),
	faq: require('./routes/faq'),
};

// static files
app.use('/assets', express.static(__dirname + '/assets'));

// page map
app.use('/', locations.home);
app.use('/', locations.connecting);
app.use('/', locations.cemu);
app.use('/', locations.faq);
app.use((request, response) => {
	const locale = utilHelper.getLocale('US', 'en');

	return response.status(404).render('404', {
		title: 'Pretendo | 404',
		description: locale.about.text,
		url: request.protocol + '://' + request.get('host') + request.originalUrl,
		baseurl: request.protocol + '://' + request.get('host'),
		locale
	});
});

// 4 parameters required to read the error, cant help the eslint error
app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
	logger.error(error.stack);
	return response.status(500).send('Something broke!');
});

// startup
app.listen(config.http.port, () => {
	logger.success(`started the server on port: ${config.http.port}`);
});
