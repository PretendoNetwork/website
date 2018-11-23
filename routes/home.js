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
router.get('/', (req, res) => {
	// needs callback because mongoose is inconsistent
	blogPostModel.latestPostsShortTemlate(2, (err, result) => {
		res.render('home', {
			user: utilHelper.templateReadyUser(req),
			locales: utilHelper.getLocales(),
			posts: result,
			page: 'home'
		});
	});
});

// export the router
module.exports = router;
