const router = require('express').Router();

/**
 * [GET]
 * Displays the home page
 */
router.get('/', (req, res) => {
	res.render('home');
});

module.exports = router;
