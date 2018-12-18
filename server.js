/*

server.js -
the file that contains the startup code

*/

// imports
const logger = require('./logger');
const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config.json');
const utilHelper = require('./helpers/util');
const passportconfig = require('./passport.config.js');

// setup console colors
require('colors');

// fix database deprecation warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
// setup database connection
mongoose.connect(config.database.url);
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

// setup express
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(session({
	secret: config.secrets.session,
	saveUninitialized: true,
	resave: true,
	cookie: {
		maxAge: 3600000,
		httpOnly: true//, // remove on production
		/*secure: true*/ // uncomment on production
	},
	// permanent session storing for MongoDB
	store: new mongoStore({
		mongooseConnection: connection,
		collection: 'sessions'
	})
}));
// setups up passportjs authentication
passportconfig(app);

// handlebars templating setup
const hbsEngine = handlebars({
	extname: '.hbs',
	layoutsDir: 'views',
	partialsDir: 'views/partials',
	helpers: {
		'if_eq': function(a, b, opts) {
			if(a == b) return opts.fn(this);
			else return opts.inverse(this);
		},
		'if_neq': function(a, b, opts) {
			if(a != b) return opts.fn(this);
			else return opts.inverse(this);
		}
	}
});
app.engine('.hbs', hbsEngine);
app.set('view engine', '.hbs');

// locations and routes setup
const locations = {
	home: require('./routes/home'),
	posts: require('./routes/blog'),
	admin: require('./routes/admin'),
	contact: require('./routes/contact'),
	progress: require('./routes/progress'),
	pnid: require('./routes/pnid')
};

// static files
app.use('/assets', express.static('assets'));
// page map
app.use('/', locations.home);
app.use('/', locations.contact);
app.use('/', locations.posts);
app.use('/', locations.admin);
app.use('/', locations.progress);
app.use('/', locations.pnid);
app.use((request, response) => {
	return utilHelper.send404(response);
});

// 4 parameters required to read the error, cant help the eslint error
app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
	logger.log('warn', error.stack);
	return response.status(500).send('Something broke!');
});

// startup
app.listen(config.http.port, () => {
	logger.log('debug', `started the server on port: ${config.http.port}`);
	console.log(`started the server on port: ${new String(config.http.port).green}`);
});
