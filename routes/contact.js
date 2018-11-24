/*

contact.js -
file for handling routes regarding contact

*/

// imports
const router = require('express').Router();
const apiHelper = require('../helpers/api');
const utilHelper = require('../helpers/util');
const config = require('../config.json');
const https = require('https');

// display contact page
router.get('/contact', (request, response) => {
	return response.render('contact', {
		title: 'Pretendo | Contact',
		user: utilHelper.templateReadyUser(request),
		locale: utilHelper.getLocale('US', 'en'),
		page: 'contact'
	});
});

/* 
*	/api/v1/sendmessage
*
*	registers a new admin user
*
*	post {
*		email - email of sender
*       subject - subject of message
*       message - actual message
*	}
*	return {
*		code: httpcode
*		success: boolean - true if sending was successull
*		errors: Strings[messages]
*	}
*/
router.post('/api/v1/sendmessage', (req, response) => {
	if (!req.body) {
		return apiHelper.sendApiGenericError(response);
	}


	const { email, subject, message } = req.body;
	if (email && subject && message && message.length < 2000) {
		// request body has everything
		const postData = JSON.stringify({
			content: 'email: ' + email + ' \n subject: ' + subject + ' \n\n' + message
		});
		
		// request object
		const request = https.request({
			hostname: config.contactWebhook.host,
			port: config.contactWebhook.port,
			path: config.contactWebhook.path,
			method  : 'POST',
			headers : {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
				'Content-Length': postData.length
			}
		}, () => {
			// sends success
			return apiHelper.sendReturn(response, {}); 
		});

		// error handling
		request.on('error', (error) => {
			console.warn('request errored' + error);
			return apiHelper.sendApiGenericError(response);
		});

		// write post data to request
		request.write(postData);
		request.end();
	} else {
		// TODO give more detailed response
		return apiHelper.sendApiGenericError(response);
	}

});

// export router
module.exports = router;
