const Trello =require('trello');
const got = require('got');
const config = require('../config.json');

const trello = new Trello(config.trello.api_key, config.trello.api_token);
const VALID_LIST_NAMES = ['Not Started', 'Started', 'Completed'];
let cache;

async function getTrelloCache() {
	const available = await trelloAPIAvailable();
	if (!available) {
		return cache || {
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

	if (!cache) {
		cache = await updateTrelloCache();
	}

	if (cache.update_time < Date.now() - (1000 * 60 * 60)) {
		cache = await updateTrelloCache();
	}

	return cache;
}

async function updateTrelloCache() {
	const progressData = {
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
			progressData.sections.push(meta);
		}
	}

	return progressData;
}

async function trelloAPIAvailable() {
	const { status } = await got('https://trello.status.atlassian.com/api/v2/status.json').json();
	return status.indicator !== 'major' && status.indicator !== 'critical';
}

module.exports = {
	getTrelloCache,
	updateTrelloCache
};