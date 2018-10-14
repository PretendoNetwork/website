/*

progress-list.js -
file containing the model for progress list

*/

// imports
const mongoose = require('mongoose');

// progress text schema
const progressListSchema = new mongoose.Schema({
	state: {
		type: Number, /* 0 - nothing, 1 - no support, 2 - partially working, 3 - works */
		default: 0
	},
	isGame: {
		type: Boolean, /* true - is game list, false - is backend service */
		required: [true, 'isGame is required']
	},
	title: {
		type: String,
		required: [true, 'Title is required']
	},
	description: {
		type:  String,
		required: [true, 'Description is required']
	}
});

const progressListModel = mongoose.model('progress', progressListSchema);

module.exports = {
	progressListModel,
	progressListSchema
};