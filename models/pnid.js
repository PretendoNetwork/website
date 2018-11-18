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
		},
		pid: {
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

	const unpacked = new Buffer(bufferToHex(buff1) + '\x02eCF' + buff2, 'ascii');
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

PNIDSchema.statics.generatePID  = async function() {
	// Quick, dirty fix for PIDs
	const pid = Math.floor(Math.random() * (4294967295 - 1000000000) + 1000000000);
	const does_pid_inuse = await PNIDModel.findOne({
		'pnid.pid': pid
	});

	if (does_pid_inuse) {
		return '' + await PNIDModel.generatePID();
	}

	return '' + pid;
};

const PNIDModel = mongoose.model('pnid', PNIDSchema);

module.exports = {
	PNIDModel,
	PNIDSchema
};