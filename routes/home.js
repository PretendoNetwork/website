/*

home.js -
file for handling routes. this one's
for routes on the root path

*/

// imports
const router = require('express').Router();

// display home page
router.get('/', (req, res) => {
	res.render('home');
});

router.get('/newhome', (req, res) => {
	res.render('newhome');
});


// export the router
module.exports = router;
