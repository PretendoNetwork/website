const getLocale = require('../../util/getLocale');
const { Router } = require('express');
const router = new Router();

const { getTrelloCache } = require('../../util/trello');

router.get('/', async (request, response) => {
	const tmpLocale = getLocale('US', 'en');
	const cache = await getTrelloCache();

	response.render('progress', {
		layout: 'main',
		locale: tmpLocale,
		progressLists: cache
	});
});

module.exports = router;
