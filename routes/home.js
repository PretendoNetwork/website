/*

home.js -
file for handling routes. this one's
for routes on the root path

*/

// imports
const router = require('express').Router();
const utilHelper = require('../helpers/util');
const blogPostModel = require('../models/blog-post').blogPostModel;

// display home page
router.get('/', (request, response) => {
	// needs callback because mongoose is inconsistent
	blogPostModel.latestPostsShortTemlate(2, (error, result) => {
		return response.render('home', {
			title: 'Pretendo | Home',
			description: 'Pretendo is a as close as possible recreation of the original Nintendo Network for 3ds and Wiiu. It is an replacement for if the original servers shut down.',
			url: request.protocol + '://' + request.get('host') + request.originalUrl,
			baseurl: request.protocol + '://' + request.get('host'),
			user: utilHelper.templateReadyUser(request),
			locale: utilHelper.getLocale('US', 'en'),
			posts: result,
			page: 'home'
		});
	});
});

// export the router
module.exports = router;
