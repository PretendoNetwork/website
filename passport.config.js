/*

passport.config.js -
Passport setup file. handles authentication strategy and session setup

*/

// imports
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const adminUserModel = require('./models/admin-user').adminUserModel;
const PNIDModel = require('./models/pnid').PNIDModel;

// setup authentication
module.exports = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());
	passport.use('adminUserStrategy', new LocalStrategy(

		(username, password, done) => {
			// find user in database
			adminUserModel.findByUsername(username).then((user) => {
				if (!user) {
					// user doesnt exist
					return done(null, false, {message: 'Incorrect user'});
				}

				bcrypt.compare(password, user.password, (err, res) => {
					if (err || !res) {
						// error comparing hashes
						return done(null, false, {message: 'Incorrect password'});
					}

					// password is correct, return user
					return done(null, user);

				});
			}).catch((err) => {
				if (err) {
					// error finding in database
					return done(null, false, {code: 500});
				}
			});
		}
	));
	passport.use('PNIDStrategy', new LocalStrategy({
		usernameField: 'email'
	}, (email, password, done) => {
		// find user in database
		PNIDModel.findByEmail(email).then((user) => {
			if (!user) {
				// user doesnt exist
				return done(null, false, {message: 'Incorrect email'});
			}

			bcrypt.compare(password, user.password, (err, res) => {
				if (err || !res) {
					// error comparing hashes
					return done(null, false, {message: 'Incorrect password'});
				}
				// password is correct, return user
				return done(null, user);
			});
		}).catch((err) => {
			if (err) {
				// error finding in database
				return done(null, false, {code: 500});
			}
		});
	}
	));
	
	//Configuring app to have sessions, dont change since it would break everything
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
		
	passport.deserializeUser(function(id, done) {
		adminUserModel.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
