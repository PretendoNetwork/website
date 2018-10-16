/*

server.js -
the file that contains the startup code

*/

// imports
const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({ extended: false }));
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
app.engine('.hbs', handlebars({
	extname: '.hbs',
	layoutsDir: 'views',
	partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');

// locations and routes setup
const locations = {
	home: require('./routes/home'),
	posts: require('./routes/blog'),
	admin: require('./routes/admin'),
	contact: require('./routes/contact'),
	progress: require('./routes/progress')
};

// static files
app.use('/assets', express.static('assets'));
// page map
app.use('/', locations.home);
app.use('/', locations.contact);
app.use('/', locations.posts);
app.use('/', locations.admin);
app.use('/', locations.progress);
app.use((req, res) => {
	utilHelper.sendDefault404(res);
});

// TODO improve error handling
// TODO remove param decoding errors from logs example: "host/test/%"
// 4 parameters required to read the error, cant help the eslint error
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	console.error(err.stack);
	return res.status(500).send('Something broke!');
});

// startup
app.listen(config.http.port, () => {
	console.log(`started the server on port: ${new String(config.http.port).green}`);
});
