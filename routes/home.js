/*

home.js -
file for handling routes. this one's
for routes on the root path

*/

// imports
const router = require('express').Router();
const utilHelper = require('../helpers/util');

// display home page
router.get('/', (req, res) => {
	res.render('home', {
		user: utilHelper.templateReadyUser(req),
		locales: utilHelper.getLocales(),
		page: 'home'
	});
});

// export the router
module.exports = router;
