/*

blog-helper.js -
blog post helper functionality

*/

// imports
const fs = require('fs');
const authors = require('../config.json').blog.authors;
const showdown  = require('showdown');
const converter = new showdown.Converter({metadata: true});


function getAuthorByID(authorId) {
	return authors[authorId];
}

function getBlogPostAsMarkdown(postId) {
	try {
		return fs.readFileSync(`posts/${postId}.md`);
	} catch(exception) {
		return null;
	}
}

function getBlogPostAsHtml(postId) {
	const markdown = getBlogPostAsMarkdown(postId);
	if (!markdown) return;
	return converter.makeHtml(markdown);
}

function getBlogPostExpressReady(postId) {
	const markdown = getBlogPostAsMarkdown(postId);
	if (!markdown) return;
	const html = converter.makeHtml(markdown);
	const metadata = converter.getMetadata();
	const hbsObject = {
		content: html,
		date: metadata.releaseDate,
		category: metadata.category,
		author: getAuthorByID(metadata.authorId)
	};

	return hbsObject;
}

function writeMarkdownToFile(text) {
	const length = fs.readdirSync('posts').length;
	fs.writeFileSync(`posts/${length}.md`, text);
}

module.exports = {
	getBlogPostAsHtml,
	getBlogPostAsMarkdown,
	getBlogPostExpressReady,
	getAuthorByID,
	writeMarkdownToFile
};
