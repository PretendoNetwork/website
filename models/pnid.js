/*

pnid.js -
file containing the model for pretendo network id's

*/

// imports
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

// admin user database layout
const PNIDSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Email is required.'],
		unique: true,
		trim: true,
		validate: [validateEmail, 'Please fill a valid email address']
	},
	email_validated: {
		type: Boolean,
		default: false
	},
	// non hashed, gets hashed at save
	password: {
		type: String,
		required: [true, 'Password is required.'],
		minlength: [7, 'Password must be at-least 7 characters.'],
		maxlength: [256, 'Password cannot be more than 256 characters long.'],
		trim: true
	},
	pnid: {
		key: {
			type: String // not sure what this should be
		}
	},
	consoles: []
});

function validateEmail(email) {
	// eslint throws "unnecesary character escape"
	const re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; // eslint-disable-line
	return re.test(email);
}

PNIDSchema.plugin(uniqueValidator, {message: '{PATH} already in use.'});

// hashing password
PNIDSchema.pre('save', function(next) {
	// only if modified
	if (!this.isModified('password')) {
		return next();
	}

	// hashing
	bcrypt.hash(this.get('password'), 10, (err, hash) => {
		if (err) {
			return next(err);
		}

		this.set('password', hash);
		next();
	});
});

PNIDSchema.statics.findByEmail = function(username) {
	return this.model('pnid').findOne({
		username
	});
};

const PNIDModel = mongoose.model('pnid', PNIDSchema);

module.exports = {
	PNIDModel,
	PNIDSchema
};