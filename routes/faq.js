const router = require('express').Router();
const utilHelper = require('../helpers/util');

router.get('/faq', (request, response) => {
	const locale = utilHelper.getLocale(request);

	return response.render('faq', {
		title: 'Pretendo | FAQ',
		description: locale.about.text,
		url: request.protocol + '://' + request.get('host') + request.originalUrl,
		baseurl: request.protocol + '://' + request.get('host'),
		locale
	});
});

module.exports = router;