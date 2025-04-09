const { Router } = require('express');
const { getGithubProjectsCache, getStripeDonationCache } = require('../cache');

const router = new Router();

router.get('/', async (request, response) => {
	const renderData = {
		progressLists: await getGithubProjectsCache(),
		donationCache: await getStripeDonationCache()
	};

	response.render('progress', renderData);
});

module.exports = router;
