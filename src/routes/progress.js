const { Router } = require('express');
const router = new Router();

const { getGithubProjectsCache, getStripeDonationCache } = require('../cache');

router.get('/', async (request, response) => {
	const renderData = 	{
		progressLists: await getGithubProjectsCache(),
		donationCache: await getStripeDonationCache()
	};

	response.render('progress', renderData);
});

module.exports = router;
