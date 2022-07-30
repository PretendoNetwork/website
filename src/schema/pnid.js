const { Schema } = require('mongoose');

// Only define what we will be using
const PNIDSchema = new Schema({
	pid: {
		type: Number,
		unique: true
	},
	server_access_level: String,
	access_level: Number,
	connections: {
		discord: {
			id: String
		},
		stripe: {
			customer_id: String,
			subscription_id: String,
			price_id: String,
			tier_level: Number,
			tier_name: String,
			latest_webhook_timestamp: Number
		}
	}
});

module.exports = PNIDSchema;
