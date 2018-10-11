/*

admin.js -
file for handling admin panel routes

*/

// import express' router
const router = require('express').Router();

// import dependencies
const common = require('../helpers/common');
const adminUserMiddleware = require('../middleware/admin-authentication');
const adminUser = require('../models/admin-user');

// display admin panel
router.get('/admin', (req, res) => {
	res.render('admin');
});

// admin login
router.post('/admin/login', (req, res) => {
	common.sendApi404(req, res);
});

// endpoints
router.use('/admin/api/v1', adminUserMiddleware);

router.post('/admin/register', (req, res) => {
	if (!req.body || !req.body.username || !req.body.password) {
		// no/wrong post body
		common.sendApiGenericError(req, res);
		return;
	}
	const { username, password } = req.body;
	
	const newUser = new adminUser.adminUserModel({
		username,
		password
	});
	
	newUser.save().then(() => {
		// successfull
		res.status(201).json({
			success: true
		});
		return;
	}).catch((rejection) => {
		res.status(500).json(rejection);
		return;
	});
});

router.post('/admin/api/v1/ping', (req, res) => {
	res.json({
		success: true,
		messsage: 'pong!'
	});
});


// export the router
module.exports = router;
