// import dependencies
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const adminUserModel = require('./models/admin-user').adminUserModel;

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
					return done(null, false);
				}

				bcrypt.compare(password, user.password, (err, res) => {
					if (err || !res) {
						// error comparing hashes
						return done(null, false);
					}

					console.log('info correct');
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
	//Configuring app to have sessions 
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
		
	passport.deserializeUser(function(id, done) {
		adminUserModel.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
