const { Router } = require('express');
const { boards } = require('../../boards/boards.json');
const router = new Router();

const { getTrelloCache, getStripeDonationCache } = require('../cache');

router.get('/', async (request, response) => {
	const renderData = 	{
		boards
	};

	const trelloCache = await getTrelloCache();
	renderData.progressLists = trelloCache;
	const stripeDonationCache = await getStripeDonationCache();
	renderData.donationCache = stripeDonationCache;

	response.render('progress', renderData);
});

module.exports = router;
