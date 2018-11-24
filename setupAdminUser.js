const mongoose = require('mongoose');
// fix database deprecation warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
// setup database connection
mongoose.connect(require('./config.json').database.url);
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

const adminUser = require('./models/admin-user');


const newUser = new adminUser.adminUserModel({
	username: 'admin',
	password: 'rootroot'
});

newUser.save().then(() => {
	console.log('success, user admin pass root');
}).catch((rejection) => {
	console.log(rejection);
});