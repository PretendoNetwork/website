const Trello = require('trello');
const Stripe = require('stripe');
const got = require('got');
const config = require('../config.json');

const trello = new Trello(config.trello.api_key, config.trello.api_token);
const stripe = new Stripe(config.stripe.secret_key);

const VALID_LIST_NAMES = ['Not Started', 'Started', 'Completed'];
let trelloCache;
let stripeDonationCache;

async function getTrelloCache() {
	const available = await trelloAPIAvailable();
	if (!available) {
		return trelloCache || {
			update_time: 0,
			sections: [{
				title: 'Upstream API error',
				id: '',
				percentage_complete: '',
				progress: {
					not_started: [ 'Trello API unavailable' ],
					started: [],
					completed: []
				}
			}],
		};
	}

	if (!trelloCache) {
		trelloCache = await updateTrelloCache();
	}

	if (trelloCache.update_time < Date.now() - (1000 * 60 * 60)) {
		trelloCache = await updateTrelloCache();
	}

	return trelloCache;
}

async function updateTrelloCache() {
	const progressCache = {
		update_time: Date.now(),
		sections: []
	};

	const boards = await trello.getOrgBoards(config.trello.board_name);

	for (const board of boards) {
		const meta = {
			title: '',
			id: '',
			percentage_complete: 0,
			progress: {
				not_started: [],
				started: [],
				completed: []
			}
		};

		meta.title = board.name;
		meta.id = board.shortLink;

		const lists = await trello.getListsOnBoard(board.id);

		const listNames = lists.map(list => list.name);
		const hasAllValidLists = listNames.every(name => VALID_LIST_NAMES.includes(name));

		if (!hasAllValidLists) {
			continue;
		}

		const cards = await trello.getCardsOnBoard(board.id);

		for (const card of cards) {
			const cardList = lists.find(({ id }) => id === card.idList);
			const listName = cardList.name.toLowerCase().replace(' ', '_');

			if (meta.progress[listName]) {
				meta.progress[listName].push(card.name);
			}
		}

		if (meta.progress.not_started.length !== 0 || meta.progress.started.length !== 0 || meta.progress.completed.length !== 0) {
			progressCache.sections.push(meta);
		}
	}

	return progressCache;
}

async function trelloAPIAvailable() {
	const { status } = await got('https://trello.status.atlassian.com/api/v2/status.json').json();
	return status.indicator !== 'major' && status.indicator !== 'critical';
}

async function getStripeDonationCache() {
	if (!stripeDonationCache) {
		stripeDonationCache = await updateStripeDonationCache();
	}

	if (stripeDonationCache.update_time < Date.now() - (1000 * 60 * 60)) {
		stripeDonationCache = await updateStripeDonationCache();
	}

	return stripeDonationCache;
}

async function updateStripeDonationCache() {
	const donationCache = {
		update_time: Date.now(),
		goal: config.stripe.goal_cents,
		total: 0,
		donators: 0,
		completed_real: 0,
		completed_capped: 0
	};

	let hasMore = true;
	let lastId;

	while (hasMore) {
		const { data: activeSubscriptions, has_more } = await stripe.subscriptions.list({
			limit: 100,
			status: 'active',
			starting_after: lastId
		});

		donationCache.donators += activeSubscriptions.length;

		for (const subscription of activeSubscriptions) {
			donationCache.total += subscription.plan.amount;
			lastId = subscription.id;
		}

		hasMore = has_more;
	}

	donationCache.completed_real = Math.floor((donationCache.total / donationCache.goal) * 100); // real completion amount
	donationCache.completed_capped = Math.max(0, Math.min(donationCache.completed_real, 100)); // capped at 100

	return donationCache;
}

module.exports = {
	getTrelloCache,
	getStripeDonationCache
};