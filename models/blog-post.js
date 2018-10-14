/*

blog-post.js -
file containing the model file for a blog post

*/

// imports
const mongoose = require('mongoose');
const common = require('../helpers/common');
const postAuthor = require('./post-author').postAuthorModel;
const showdown  = require('showdown');
const converter = new showdown.Converter();
converter.setFlavor('github');

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
			default: () => {
				return new Date(common.convertDateToString(new Date()));
			}
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
blogPostSchema.methods.getBlogPostTemplateReady = function(callback) {
	const self = this;
	postAuthor.findById(this.meta.author, function (err, author) {
		callback(err, {
			content: self.content,
			title: self.name,
			date: self.meta.date,
			category: self.meta.category,
			author: author.getPostAuthorTemplateReady()
		});
	});
};

blogPostSchema.statics.convertMarkdownToHtml = function(markdown) {
	return converter.makeHtml(markdown);
};
blogPostSchema.statics.getPost = function(date, urlTitle, callback) {
	return blogPostModel.findOne({
		'meta.date': date,
		'meta.urlTitle': urlTitle
	}, callback);
};

const blogPostModel = mongoose.model('blogPost', blogPostSchema);

module.exports = {
	blogPostModel,
	blogPostSchema
};