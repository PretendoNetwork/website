const router = require('express').Router();
const utilHelper = require('../helpers/util');

router.get('/cemu', (request, response) => {
	const locale = utilHelper.getLocale(request);

	return response.render('cemu', {
		title: 'Pretendo | Cemu',
		description: locale.about.text,
		url: request.protocol + '://' + request.get('host') + request.originalUrl,
		baseurl: request.protocol + '://' + request.get('host'),
		locale
	});
});

module.exports = router;