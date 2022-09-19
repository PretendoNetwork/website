const { Router } = require('express');
const router = new Router();

const { getGithubProjectsCache } = require('../cache');

router.get('/', async (request, response) => {
	const renderData = 	{};

	const githubProjectsCache = await getGithubProjectsCache();

	// Builds the arrays of people for the special thanks section

	// Shuffles the special thanks people
	const specialThanksPeople = response.locals.locale.specialThanks.people.slice();
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	shuffleArray(specialThanksPeople);

	// Slices the array in half
	const specialThanksFirstRow = specialThanksPeople.slice(0, 4);
	const specialThanksSecondRow = specialThanksPeople.slice(4);

	// Builds the final array to be sent to the view, and triples each row.
	renderData.specialThanksPeople = {
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
		cards: {
			todo: [],
			in_progress: [],
			done: []
		}
	};

	// Calculates individual completion percentages and progress states
	githubProjectsCache.sections.forEach(section => {
		const { todo, in_progress, done } = section.cards;

		// Calculates the completion percentage of the project, and sums it to the total
		const sectionCompletionPercentage = ((done.length + in_progress.length * 0.5) / (done.length + in_progress.length + todo.length)) || 0;
		totalProgress._calc.percentageSum += sectionCompletionPercentage;

		const sectionTitle = `${section.title}  [${Math.round(sectionCompletionPercentage * 100)}%]`;

		if (done !== [] && in_progress + todo === []) {
			// if all the section tasks have been done, push to done
			totalProgress.cards.done.push(sectionTitle);
		} else if (todo !== [] && in_progress + done === []) {
			// if none the section tasks have been done or in_progress, push to todo
			totalProgress.cards.todo.push(sectionTitle);
		} else {
			// for all other combos, push to in_progress
			totalProgress.cards.in_progress.push(sectionTitle);
		}
	});

	// Calculates global completion percentage
	totalProgress.percent = Math.round(totalProgress._calc.percentageSum / githubProjectsCache.sections.length * 100);

	renderData.featuredFeatureList = totalProgress;

	response.render('home', renderData);
});

module.exports = router;
