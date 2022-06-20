const { Schema } = require('mongoose');

// Only define what we will be using
const PNIDSchema = new Schema({
	pid: {
		type: Number,
		unique: true
	},
	server_access_level: String,
	access_level: Number,
});

module.exports = PNIDSchema;