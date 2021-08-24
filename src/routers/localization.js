const { Router } = require('express');
const util = require('../util');
const router = new Router();

router.get('/', async (request, response) => {

	const reqLocale = request.locale
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	response.render('localization', {
		layout: 'main',
		locale,
		localeString: reqLocale.toString(),
	});
});

module.exports = router;
