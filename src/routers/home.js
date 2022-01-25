const { Router } = require('express');
const util = require('../util');
const { boards } = require('../../boards/boards.json');
const logger = require('../logger');
const router = new Router();

const { getTrelloCache } = require('../trello');

router.get('/', async (request, response) => {

	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);
	const cache = null
	try {
	 cache = await getTrelloCache();
	}
	catch(e){
		logger.warn(`Trello Error: ${e}`)
	}
	// Builds the arrays of people for the special thanks section

	// Shuffles the special thanks people
	let specialThanksPeople = locale.specialThanks.people.slice();
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	shuffleArray(specialThanksPeople);

	// Slices the array in half
	const specialThanksFirstRow = specialThanksPeople.slice(0, 3);
	const specialThanksSecondRow = specialThanksPeople.slice(3, 7);

	// Builds the final array to be sent to the view, and triples each row.
	specialThanksPeople = {
		first: specialThanksFirstRow.concat(specialThanksFirstRow).concat(specialThanksFirstRow),
		second: specialThanksSecondRow.concat(specialThanksSecondRow).concat(specialThanksSecondRow)
	};
	if (cache){
		var featuredFeatureList = cache.sections[0]
	}
	response.render('home', {
		layout: 'main',
		featuredFeatureList: featuredFeatureList,
		boards,
		locale,
		localeString: reqLocale.toString(),
		specialThanksPeople
	});
});

module.exports = router;
