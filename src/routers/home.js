const { Router } = require('express');
const util = require('../util');
const router = new Router();

const { getTrelloCache } = require('../trello');

router.get('/', async (request, response) => {

	const reqLocale = request.locale
	const locale = util.getLocale(reqLocale.region, reqLocale.language);
	
	const cache = await getTrelloCache();

	response.render('home', {
		layout: 'main',
		locale,
		localeString: reqLocale.toString(),
		featuredFeatureList: cache.sections[0]
	});
});

module.exports = router;
