const { Router } = require('express');
const util = require('../util');
const { boards } = require('../../boards/boards.json');
const router = new Router();

const { getTrelloCache } = require('../cache');

router.get('/', async (request, response) => {

	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const cache = await getTrelloCache();

	response.render('progress', {
		layout: 'main',
		boards,
		locale,
		localeString: reqLocale.toString(),
		progressLists: cache
	});
});

module.exports = router;
