const router = require('express').Router();

/**
 * [GET]
 * Displays the account web page if user is authenticated,
 * and redirects to the login page if not
 */
router.get('/', (req, res) => {
	//res.render('account/dashboard');
});

/**
 * [GET]
 * Displays the login web page
 */
router.get('/login', (req, res) => {
	res.render('account/login');
});

/**
 * [POST]
 * Recieves data from web form
 */
router.post('/login/authenticate', (req, res) => {
	
});

module.exports = router;
