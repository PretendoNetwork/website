const { Router } = require('express');
const util = require('../util');
const router = new Router();

const { getTrelloCache } = require('../../util/trello');

router.get('/', async (request, response) => {
	const tmpLocale = util.getLocale('US', 'en');
	const cache = await getTrelloCache();

	response.render('home', {
		layout: 'main',
		locale: tmpLocale,
		featuredFeatureList: cache.sections[0]
	});
});

module.exports = router;
