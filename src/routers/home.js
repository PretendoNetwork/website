const { Router } = require('express');
const util = require('../util');
const { boards } = require('../../boards/boards.json');
const router = new Router();

const { getTrelloCache } = require('../trello');

router.get('/', async (request, response) => {

	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const cache = await getTrelloCache();

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

	// Progress

	// Creates an object to hold the total progress
	const totalProgress = {
		title: null,
		_calc: {
			percentageSum: 0
		},
		percent: 0,
		progress: {
			not_started: [],
			started: [],
			completed: []
		}
	};

	// Calculates individual completion percentages and progress states
	cache.sections.forEach(section => {
		const { not_started, started, completed } = section.progress;

		const sectionCompletionPercentage = completed.length / (completed.length + started.length + not_started.length);
		totalProgress._calc.percentageSum += sectionCompletionPercentage;

		const sectionTitle = `${section.title}  [${Math.round(sectionCompletionPercentage * 100)}%]`;

		if (completed !== [] && started + not_started === []) {
			// if all the section tasks have been completed, push to completed
			totalProgress.progress.completed.push(sectionTitle);
		} else if (not_started !== [] && started + completed === []) {
			// if none the section tasks have been completed or started, push to not started
			totalProgress.progress.not_started.push(sectionTitle);
		} else {
			// for all other combos, push to started
			totalProgress.progress.started.push(sectionTitle);
		}
	});

	// Calculates global completion percentage
	totalProgress.percent = Math.round(totalProgress._calc.percentageSum / cache.sections.length * 100);

	response.render('home', {
		layout: 'main',
		featuredFeatureList: totalProgress,
		boards,
		locale,
		localeString: reqLocale.toString(),
		specialThanksPeople
	});
});

module.exports = router;
