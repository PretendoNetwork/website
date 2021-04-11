
const progressLists = require('../progress-lists.json');

const statusPriorityOrder = ['done', 'ongoing', 'todo'];

// Sort by status
for(const list of progressLists) {
	list.features = list.features.sort((a, b) => {
		return statusPriorityOrder.indexOf(a.status) - statusPriorityOrder.indexOf(b.status);
	});
}

module.exports = progressLists;