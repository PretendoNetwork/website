const mongoose = require('mongoose');
const config = require('./config');
const PNIDSchema = require('./schema/pnid');

const accountServerConfig = config.database.account;
const { connection_string, options } = accountServerConfig;
let accountServerDBConnection;
let PNID;

async function connect() {
	accountServerDBConnection = await mongoose.createConnection(connection_string, options);
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
