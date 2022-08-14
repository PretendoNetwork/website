const mongoose = require('mongoose');
const PNIDSchema = require('./schema/pnid');
const config = require('../config.json');

const accountServerConfig = config.database.account;
const { uri, database, options } = accountServerConfig;
let accountServerDBConnection;
let PNID;

async function connect() {
	accountServerDBConnection = await mongoose.createConnection(`${uri}/${database}`, options);
	accountServerDBConnection.on('error', console.error.bind(console, 'Mongoose connection error:'));
	accountServerDBConnection.on('close', () => {
		accountServerDBConnection.removeAllListeners();
	});

	await accountServerDBConnection.asPromise();

	PNID = accountServerDBConnection.model('PNID', PNIDSchema);

	module.exports.PNID = PNID;
}

module.exports = {
	connect,
	PNID
};
