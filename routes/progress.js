/*

progress.js -
file for handling routes regarding progress

*/

// imports
const router = require('express').Router();
const common = require('../helpers/common');
const staticText = require('../static-text.json');
const progressListModel = require('../models/progress-list').progressListModel;

// display progress
router.get('/progress', (req, res) => {
	
	progressListModel.find({}, (err, progress) => {
		if (err) return common.sendDefault404(res);
		console.log(progress);
		let games = [];
		let backends = [];
		for (const i in progress) {
			if (progress[i].isGame) 
				games += progress[i];
			else 
				backends += progress[i];
		}
		console.log(games + backends);
		res.render('progress', {
			games,
			backends,
			summary: staticText.progressSummary
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
		if (err) return common.sendApiError(res, 500, [err]);
		common.sendApiReturn(res, {
			progressList: progress
		});
	});
});

// export router
module.exports = router;
