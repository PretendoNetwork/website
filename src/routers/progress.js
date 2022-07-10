const { Router } = require('express');
const util = require('../util');
const { boards } = require('../../boards/boards.json');
const router = new Router();

const { getTrelloCache, getStripeDonationCache } = require('../cache');

router.get('/', async (request, response) => {
	const renderData = 	{
		boards
	};

	renderData.isLoggedIn = request.cookies.access_token && request.cookies.refresh_token && request.cookies.ph;

	if (renderData.isLoggedIn) {
		const account = await util.getAccount(request, response);
		renderData.account = account;
	}

	const trelloCache = await getTrelloCache();
	renderData.progressLists = trelloCache;
	const stripeDonationCache = await getStripeDonationCache();
	renderData.donationCache = stripeDonationCache;

	response.render('progress', renderData);
});

module.exports = router;
