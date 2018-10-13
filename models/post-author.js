/*

blog-post.js -
file containing the model file for a blog post

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
	image: {
		type: String,
		trim: true
	}
});

postAuthorSchema.methods.getPostAuthorTemplateReady = function() {
	return {
		authorName: this.name,
		authorDescription: this.description,
		authorProfilePicture: this.image
	};
};

const postAuthorModel = mongoose.model('postAuthor', postAuthorSchema);

module.exports = {
	postAuthorModel,
	postAuthorSchema
};