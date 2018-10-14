/*

contact.js -
file for handling routes regarding contact

*/

// imports
const router = require('express').Router();
const common = require('../helpers/common');
const config = require('../config.json');
const https = require('https');

// display contact page
router.get('/contact', (req, res) => {
	res.render('contact');
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
router.post('/api/v1/sendmessage', function (req, res) {
	if (!req.body) return common.sendApiGenericError(res);

	const { email, subject, message } = req.body;
	if (email && subject && message && message.length < 2000) {
		console.log('checks passed');
		const postData = JSON.stringify({
			content: 'email: ' + email + ' \n subject: ' + subject + ' \n\n' + message
		});
		
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
			common.sendApiReturn(res, {}); 
		});

		request.on('error', (e) => {
			common.sendApiGenericError(res);
			console.log('request errored' + e);
		});

		request.write(postData);
		request.end();
	} else {
		// TODO give more detailed response
		return common.sendApiGenericError(res);
	}

});

// export router
module.exports = router;
