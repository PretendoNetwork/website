const { Router } = require('express');
const util = require('../util');
const { boards } = require('../../boards/boards.json');
const router = new Router();

const { getTrelloCache } = require('../trello');

router.get('/', async (request, response) => {

	const reqLocale = request.locale
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const localeString = reqLocale.toString()

	const cache = await getTrelloCache();

	response.render('progress', {
		layout: 'main',
		boards,
		locale,
		localeString,
		progressLists: cache
	});
});

module.exports = router;
