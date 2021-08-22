const { Router } = require('express');
const util = require('../util');
const { boards } = require('../../boards/boards.json');
const router = new Router();

const { getTrelloCache } = require('../trello');

router.get('/', async (request, response) => {

	const reqLocale = request.locale
	const locale = util.getLocale(reqLocale.region, reqLocale.language);
	
	const cache = await getTrelloCache();

	response.render('home', {
		layout: 'main',
		featuredFeatureList: cache.sections[0],
		boards,
		locale,
		localeString: reqLocale.toString(),
	});
});

module.exports = router;
