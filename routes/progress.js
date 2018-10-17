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
router.get('/progress', (req, res) => {
	
	progressListModel.find({}, (err, progress) => {
		if (err) return utilHelper.send404(res);
		
		// filtering games and backend
		const games = progress.filter(i => i.isGame);
		const backends = progress.filter(i => !i.isGame);

		res.render('progress', {
			games,
			backends
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
router.get('/api/v1/listprogress', function (req, res) {
	progressListModel.find({}, (err, progress) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (err) return apiHelper.sendApiError(res, 500, [err]);
		apiHelper.sendReturn(res, {
			progressList: progress
		});
	});
});

// export router
module.exports = router;
