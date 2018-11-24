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
			user: utilHelper.templateReadyUser(request),
			locale: utilHelper.getLocale('US', 'en'),
			posts: result,
			page: 'home'
		});
	});
});

// export the router
module.exports = router;
