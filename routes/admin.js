/*

admin.js -
file for handling admin panel routes

*/

// import express' router
const router = require('express').Router();

// display admin panel
router.get('/admin', (req, res) => {
	res.render('admin');
});

// export the router
module.exports = router;
