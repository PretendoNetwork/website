const { Router } = require('express');
const util = require('../util');
const { boards } = require('../../boards/boards.json');
const logger = require('../logger');
const router = new Router();

const { getTrelloCache } = require('../trello');

router.get('/', async (request, response) => {

	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const cache = null
	try{
	 cache= await getTrelloCache();
	}
	catch(e){
		logger.warn(e)
	}
	response.render('progress', {
		layout: 'main',
		boards,
		locale,
		localeString: reqLocale.toString(),
		progressLists: cache
	});
});

module.exports = router;
