/*

home.js -
file for handling routes. this one's
for routes on the root path

*/

// imports
const router = require('express').Router();
const utilHelper = require('../helpers/util');

// display home page
router.get('/', (request, response) => {
	const locale = utilHelper.getLocale('US', 'en');

	return response.render('home', {
		title: 'Pretendo | Home',
		description: locale.about.text,
		url: request.protocol + '://' + request.get('host') + request.originalUrl,
		baseurl: request.protocol + '://' + request.get('host'),
		locale
	});
});

// export the router
module.exports = router;
