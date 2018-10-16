/*

blog-post.js -
file containing the model file for a blog post

*/

// imports
const mongoose = require('mongoose');
const postAuthor = require('./post-author').postAuthorModel;
const showdown  = require('showdown');
const moment = require('moment');
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
	short: {
		type: String,
		required: [true, 'Short version is required']
	},
	meta: {
		slug: {
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
				return new Date(moment(new Date(), 'YYYY-MM-DD'));
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
blogPostSchema.methods.getBlogPostShortTemplateReady = function() {
	return {
		content: this.short,
		title: this.name,
		url: moment(this.meta.date, 'YYYY-MM-DD') + '/' + this.meta.slug
	};
};

blogPostSchema.statics.convertMarkdownToHtml = function(markdown) {
	return converter.makeHtml(markdown);
};
blogPostSchema.statics.getPost = function(date, slug, callback) {
	return blogPostModel.findOne({
		'meta.date': date,
		'meta.slug': slug
	}, callback);
};
// not tested
blogPostSchema.statics.getLatestBlogPostShortTemplateReady = function(amount, callback) {
	blogPostModel.find({}).sort({'meta.date': 'desc'}).exec(function(err, posts) {
		if (err) return callback(err);
		let out = [];
		for (let i = 0, l = posts.length; i < ( amount+1 < l ? amount+1 : l); i++)
			out += posts[i].getBlogPostShortTemplateReady();
		callback(err, out);
	});
};

const blogPostModel = mongoose.model('blogPost', blogPostSchema);

module.exports = {
	blogPostModel,
	blogPostSchema
};