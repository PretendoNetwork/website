const { Router } = require('express');
const util = require('../util');
const router = new Router();


router.get('/', async (request, response) => {

	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const localeString = reqLocale.toString();

	response.render('blog', {
		layout: 'main',
		locale,
		localeString,
	});
});

module.exports = router;
