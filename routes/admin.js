/*

admin.js -
file for handling admin panel routes

*/

// import express' router
const router = require('express').Router();

// import dependencies
const passport = require('passport');
const common = require('../helpers/common');
const adminUserMiddleware = require('../middleware/admin-authentication');
const adminUser = require('../models/admin-user');

// display admin panel
router.get('/admin', (req, res) => {
	res.render('admin');
});

/* 
*	/admin/api/v1/login
*
*	signs admin user in
*
*	post {
*		username - username of admin account
*		password - password of admin account
*	}
*	return {
*		code: http code
*		success: boolean - true if login succesfull
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/login', passport.authenticate('adminUserStrategy'), function (req, res) {
	res.json({
		message: 'sucessfull I guess',
		isAuthed: req.isAuthenticated()
	});
});

/* 
*	/admin/api/v1/register
*	- requires admin auth
*
*	registers a new admin user
*
*	post {
*		username - username of new admin account
*		password - password of new admin account
*	}
*	return {
*		code: httpcode,
*		success: boolean,
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/register', adminUserMiddleware.authenticationRequired, (req, res) => {
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

/* 
*	/admin/api/v1/check
*
*	checks if admin logged in
*
*	return {
*		code: httpcode
*		success: boolean - true if admin logged in
*		errors: Strings[messages]
*	}
*/
router.get('/admin/api/v1/check', adminUserMiddleware.authenticationOptional, (req, res) => {
	res.status(200).json({
		code: 200,
		success: req.isAuthenticated()
	});
});

// export the router
module.exports = router;
