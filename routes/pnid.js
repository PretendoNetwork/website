/*

admin.js -
file for handling admin api.

*/

// imports
const router = require('express').Router();
const passport = require('passport');
const userMiddleware = require('../middleware/authentication');
const apiHelper = require('../helpers/api');
const utilHelper = require('../helpers/util');
const config = require('../config.json');
const Recaptcha = require('express-recaptcha').Recaptcha;
const recaptcha = new Recaptcha(config.recaptcha.siteKey, config.recaptcha.secretKey);

// database models
const PNID = require('../models/pnid');

// renders register page
router.get('/pnid/register', recaptcha.middleware.render, (request, response) => {
	return response.render('register', {
		title: 'Pretendo | Register',
		captcha: response.recaptcha,
		locale: utilHelper.getLocale('US', 'en')
	});
});
// renders login page
router.get('/pnid/login', (request, response) => {
	return response.render('login', {
		title: 'Pretendo | Login',
		locale: utilHelper.getLocale('US', 'en')
	});
});
// logout
router.get('/pnid/logout', userMiddleware.pnidAuthNeeded, (request, response) => {
	request.logout();
	return response.redirect('/');
});
// renders pnid dashboard
router.get('/pnid/dashboard', userMiddleware.pnidAuthNeeded, (request, response) => {
	return response.render('dashboard', {
		title: 'Pretendo | Dash',
		locale: utilHelper.getLocale('US', 'en'),
		user: utilHelper.templateReadyUser(request)
	});
});

/* 
*	/api/v1/login
*
*	signs user in
*
*	post {
*		email
*		password
*	}
*	return {
*		code: http code
*		success: boolean
*		username: undefined | string - only if login was successfull
*		role: undefined | string - role of user if login was successfull
*		errors: Strings[messages] - not yet :(
*	}
*/
// TODO make login somehow display errors in correct format.
// middleware does the authentication work. this just returns a success
router.post('/api/v1/login', passport.authenticate('PNIDStrategy'), function (request, response) {
	return apiHelper.sendReturn(response, {
		email: request.user.email,
		email_validated: request.user.email_validated,
		pnid: request.user.pnid.key
	});
});

/* 
*	/api/v1/register
*
*	registers a new admin user
*
*	post {
*		username
*		password
*	}
*	return {
*		code: httpcode
*		success: boolean - true if register was successull
*		username: undefined | string - username if register was successfullW
*		errors: Strings[messages]
*	}
*/
router.post('/api/v1/register', recaptcha.middleware.verify, async (request, response) => {
	if (!request.body) {
		// no post body
		return apiHelper.sendApiGenericError(response);
	}
	/*if (request.recaptcha.error) {
		apiHelper.sendApiError(response, 500, ['Captcha error']);
		return;
	}*/

	const { email, password } = request.body;
	const newUser = new PNID.PNIDModel({
		email,
		password,
		pnid: {
			key: 'abcd',
			pid: await PNID.PNIDModel.generatePID()
		}
	});

	// TODO verify password
	
	// saving to database
	newUser.save().then((user) => {
		return apiHelper.sendReturn(response, {
			email: user.email,
			email_validated: user.email_validated,
			pnid: user.pnid.key
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		console.warn(rejection);
		return apiHelper.sendApiError(response, 500, [rejection]);
	});
});

// export the router
module.exports = router;
