/*

pnid.js -
file containing the model for pretendo network id's

*/

// imports
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const randtoken = require('rand-token');
const bcrypt = require('bcrypt');
const utilHelper = require('../helpers/util');

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
	email_validation_code: {
		type: Number,
		required: [true, 'Email validation code is required.'],
	},
	email_validation_token: {
		type: String,
		required: [true, 'Email validation token is required.'],
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
		pid: {
			type: Number,
			unique: true
		},
		username: {
			type: String,
			unique: true
		},
		username_lower: {
			type: String,
			unique: true
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
	const primaryhash = PNIDModel.hashPasswordPrimary(this.get('password'), this.get('pnid.pid'));
	bcrypt.hash(primaryhash, 10, (err, hash) => {
		if (err) {
			return next(err);
		}

		this.set('password', hash);
		next();
	});
});

PNIDSchema.statics.findByEmail = function(email) {
	return this.model('pnid').findOne({
		email
	});
};

PNIDSchema.statics.hashPasswordPrimary = function(password, pid) {
	const buff1 = require('python-struct').pack('<I', pid);
	const buff2 = Buffer.from(password).toString('ascii');

	const unpacked = Buffer.from(bufferToHex(buff1) + '\x02eCF' + buff2, 'ascii');
	const hashed = require('crypto').createHash('sha256').update(unpacked).digest().toString('hex');

	return hashed;
};

function bufferToHex(buff) {
	let result = '';
	const arr = buff.toString('hex').match(/.{1,2}/g);
	for (let i=0;i<arr.length;i++) {
		const char = arr[i];
		result += String.fromCharCode(parseInt(char, 16));
	}
	result.replace(/\\/g, '&#92;');
	return result;
}

PNIDSchema.statics.generatePID = async function() {
	// Quick, dirty fix for PIDs
	const pid = Math.floor(Math.random() * (4294967295 - 1000000000) + 1000000000);
	const pid_inuse = await PNIDModel.findOne({
		'pnid.pid': pid
	});

	if (pid_inuse) {
		return await PNIDModel.generatePID();
	}

	return pid;
};

PNIDSchema.statics.generateEmailValidationCode = async function() {
	const code = utilHelper.generateRandomInt(6);
	const code_inuse = await PNIDModel.findOne({
		'email_validation_code': code
	});
		
	if (code_inuse) {
		return await PNIDModel.generateEmailValidationCode();
	}

	return code;
};

PNIDSchema.statics.generateEmailValidationToken = async function() {
	const token = randtoken.generate(32);
	const token_inuse = await PNIDModel.findOne({
		'email_validation_token': token
	});
		
	if (token_inuse) {
		return await PNIDModel.generateEmailValidationToken();
	}

	return token;
};

const PNIDModel = mongoose.model('pnid', PNIDSchema);

module.exports = {
	PNIDModel,
	PNIDSchema
};