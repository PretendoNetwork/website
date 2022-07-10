const { Router } = require('express');
const util = require('../util');
const router = new Router();

router.get('/', async (request, response) => {
	const renderData = 	{};

	renderData.isLoggedIn = request.cookies.access_token && request.cookies.refresh_token && request.cookies.ph;

	if (renderData.isLoggedIn) {
		const account = await util.getAccount(request, response);
		renderData.account = account;
	}
	
	response.render('localization', renderData);
});

module.exports = router;
