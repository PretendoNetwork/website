const adminUser = require('./models/admin-user');

const newUser = new adminUser.adminUserModel({
	username: 'admin',
	password: 'root'
});

newUser.save().then(() => {
	console.log('success, user admin pass root');
}).catch((rejection) => {
	console.log(rejection);
});