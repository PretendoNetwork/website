const { Router } = require('express');
const util = require('../util');
const { boards } = require('../../boards/boards.json');
const router = new Router();

const { getTrelloCache } = require('../trello');

router.get('/', async (request, response) => {
	const tmpLocale = util.getLocale('US', 'en');
	const cache = await getTrelloCache();

	response.render('progress', {
		layout: 'main',
		locale: tmpLocale,
		progressLists: cache,
		boards,
	});
});

module.exports = router;
