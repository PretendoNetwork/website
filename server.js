/*

server.js -
the file that contains the code to run the server

*/

// module imports, and
// some important variable defs
const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config.json');
const app = express();
const common = require('./helpers/common');
const adminUserModel = require('./models/admin-user').adminUserModel;

// import the colors module
require('colors');

// locations for some files
const locations = {
	home: require('./routes/home'),
	posts: require('./routes/blog'),
	admin: require('./routes/admin')
};

// setup body parser
app.use(bodyParser.urlencoded({ extended: false }));

// setup database
mongoose.connect(config.database.url);
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

// setup session
app.use(session({
	secret: config.secrets.session,
	//cookie: { secure: true } // use when https is enabled
}));

// setup authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use('adminUserStrategy', new LocalStrategy(
	(username, password, done) => {
		// find user in database
		adminUserModel.findByUsername(username).then((user) => {
			if (!user) {
				// user doesnt exist
				return done(null, false);
			}

			bcrypt.compare(password, user.password, (err, res) => {
				if (err || !res) {
					// error comparing hashes
					return done(null, false);
				}

				// password is correct, return user
				return done(null, user);

			});
		}).catch((err) => {
			if (err) {
				// error finding in database
				return done(null, false);
			}
		});
	}
));

// load the handlebars module
app.engine('.hbs', handlebars({
	extname: '.hbs',
	layoutsDir: 'views',
	partialsDir: 'views/partials'
}));

// set express to use handlebars
// as the templating engine
app.set('view engine', '.hbs');

// set some routes on the server

// assets folder serving
app.use('/assets', express.static('assets'));

// website root
app.use('/', locations.home);

// blog posts
app.use('/', locations.posts);

// admin panel
app.use('/', locations.admin);

// send a 404 on a file not
// being found
app.use(common.sendDefault404);

// start the server
app.listen(config.http.port, () => {
	console.log(`started the server on port: ${new String(config.http.port).green}`);
});
