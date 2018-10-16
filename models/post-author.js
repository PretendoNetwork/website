/*

post-author.js -
file containing the model for authors

*/

// imports
const mongoose = require('mongoose');

// post author database layout
const postAuthorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		trim: true
	},
	description: {
		type: String,
		required: [true, 'Description is required'],
		trim: true
	},
	// profile picture image link
	image: {
		type: String,
		trim: true
	}
});

postAuthorSchema.methods.authorTemplate = function() {
	return {
		name: this.name,
		description: this.description,
		profilePicture: this.image
	};
};

const postAuthorModel = mongoose.model('postAuthor', postAuthorSchema);

module.exports = {
	postAuthorModel,
	postAuthorSchema
};