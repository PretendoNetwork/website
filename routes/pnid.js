/*

admin.js -
file for handling admin api.

*/

// imports
const logger = require('winston');
const router = require('express').Router();
const passport = require('passport');
const userMiddleware = require('../middleware/authentication');
const apiHelper = require('../helpers/api');
const utilHelper = require('../helpers/util');
const mailer = require('../mailer');
const config = require('../config.json');
const Recaptcha = require('express-recaptcha').Recaptcha;
const recaptcha = new Recaptcha(config.recaptcha.siteKey, config.recaptcha.secretKey);

// database models
const PNID = require('../models/pnid');

// renders register page
router.get('/pnid/register', (request, response) => {
	return response.render('register', {
		title: 'Pretendo | Register',
		locale: utilHelper.getLocale('US', 'en'),
		recaptcha_sitekey: config.recaptcha.siteKey
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
		return apiHelper.sendApiGenericError(response);
	}

	if (request.recaptcha.error) {
		logger.log('warn', `[reCaptcha ERROR] ${request.recaptcha.error} | IP: ${request.ip} | Data: ${JSON.stringify(request.body)}`);
		return apiHelper.sendApiError(response, 500, ['Captcha error']);
	}

	const { email, password, confirm_password, username } = request.body;

	if (password !== confirm_password) {
		return apiHelper.sendApiError(response, 400, ['Passwords do not match']);
	}

	const email_validation_code = await PNID.PNIDModel.generateEmailValidationCode();
	const email_validation_token = await PNID.PNIDModel.generateEmailValidationToken();

	const newUser = new PNID.PNIDModel({
		email,
		email_validation_code,
		email_validation_token,
		password,
		pnid: {
			pid: await PNID.PNIDModel.generatePID(),
			username,
			username_lower: username.toLowerCase()
		}
	});
	
	// saving to database
	newUser.save().then((user) => {
		mailer.send(
			user.get('email'),
			'[Pretendo Network] Please confirm your e-mail address',
			`Hello,
			Your Pretendo Network ID activation is almost complete.  Please click the link below to confirm your e-mail address and complete the activation process.
			
			https://account.pretendo.cc/account/email-confirmation?token${user.get('email_validation_token')}
			
			If you are unable to connect to the above URL, please enter the following confirmation code on the device to which your Pretendo Network ID is linked.
			
			&lt;&lt;Confirmation code: ${user.get('email_validation_code')}&gt;&gt;`
		);

		return apiHelper.sendReturn(response, {
			email: user.email,
			email_validated: user.email_validated,
			pnid: user.pnid.pid
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		logger.log('warn', rejection);
		return apiHelper.sendApiError(response, 500, [rejection]);
	});
});

// export the router
module.exports = router;
