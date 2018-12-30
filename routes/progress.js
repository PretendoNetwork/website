/*

progress.js -
file for handling routes regarding progress

*/

// imports
const router = require('express').Router();
const apiHelper = require('../helpers/api');
const utilHelper = require('../helpers/util');
const progressListModel = require('../models/progress-list').progressListModel;

// display progress
router.get('/progress', (request, response) => {
	
	progressListModel.find({}, (error, progress) => {
		if (error) {
			return utilHelper.send404(response);
		}
		
		// filtering games and backend
		const games = progress.filter(i => i.isGame);
		const backends = progress.filter(i => !i.isGame);

		return response.render('progress', {
			title: 'Pretendo | Progress',
			description: 'The Pretendo progress page shows the progress the Pretendo developer team made. It shows how much is working and if it can be used for the end user yet.',
			url: request.protocol + '://' + request.get('host') + request.originalUrl,
			baseurl: request.protocol + '://' + request.get('host'),
			games,
			backends,
			user: utilHelper.templateReadyUser(request),
			locale: utilHelper.getLocale('US', 'en'),
			page: 'progress'
		});
	});
});

/* 
*	/api/v1/listprogress
*
*	gets a list of progress
*
*	return {
*		code: http code
*		success: boolean - true if progress succesfull
*		progressList: Objects[{_id, title, description, state}] - list of progress with information
*		errors: Strings[messages]
*	}
*/
router.get('/api/v1/listprogress', (request, response) => {
	progressListModel.find({}, (error, progress) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (error) {
			return apiHelper.sendApiError(response, 500, [error]);
		}

		apiHelper.sendReturn(response, {
			progressList: progress
		});
	});
});

// export router
module.exports = router;
