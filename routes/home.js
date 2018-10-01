/*

home.js -
file for handling routes. this one's
for routes on the root path

*/

// import express' router
const router = require('express').Router();

// display home page
router.get('/', (req, res) => {
	res.render('home');
});

// display contact page
router.get('/contact', (req, res) => {
	res.render('contact');
});

// export the router
module.exports = router;
