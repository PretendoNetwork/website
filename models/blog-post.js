/*

blog-post.js -
file containing the model file for a blog post

*/

// imports
const mongoose = require('mongoose');
const postAuthor = require('./post-author').postAuthorModel;
const showdown  = require('showdown');
const converter = new showdown.Converter();

// admin user database layout
const blogPostSchema = new mongoose.Schema({
	// html in content
	content: {
		type: String,
		required: [true, 'Content is required.'],
		trim: true
	},
	name: {
		type: String,
		required: [true, 'Name is required']
	},
	meta: {
		urlTitle: {
			type: String,
			required: [true, 'Author is required'],
			trim: true
		},
		author: {
			type: String,
			required: [true, 'Author is required'],
			trim: true
		},
		date: {
			type: Date,
			default: Date.now
		},
		category: {
			type: String,
			required: [true, 'category is required'],
			trim: true
		}
	}
});

blogPostSchema.methods.getContentAsHTML = function() {
	return this.content;
};
blogPostSchema.methods.getBlogPostTemplateReady = function() {
	return {
		content: this.content,
		title: this.name,
		date: this.meta.date,
		category: this.meta.category,
		author: postAuthor.findById(this.meta.author).getPostAuthorTemplateReady()
	};
};

blogPostSchema.statics.convertMarkdownToHtml = function(markdown) {
	return converter.makeHtml(markdown);
};
blogPostSchema.statics.getPost = function(date, urlTitle, callback) {
	return blogPostModel.findOne({
		meta: {
			date,
			urlTitle
		}
	}, callback);
};

const blogPostModel = mongoose.model('blogPost', blogPostSchema);

module.exports = {
	blogPostModel,
	blogPostSchema
};