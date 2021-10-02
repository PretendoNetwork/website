const { Router } = require('express');
const util = require('../util');
const logger = require('../logger');
const router = new Router();

const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

const postList = () => {
	const files = fs.readdirSync('blogposts');

	// We get the info for each blogpost, ignoring the ones starting with _
	const posts = files
		.filter(filename => !filename.startsWith('_'))
		.filter(filename => filename.endsWith('.md')) // Ignores other files/folders
		.map((filename) => {
			const slug = filename.replace('.md', '');
			const rawPost = fs.readFileSync(
				path.join('blogposts', `${filename}`),
				'utf-8'
			);
			const { data: postInfo } = matter(rawPost);
			return {
				slug,
				postInfo,
			};
		});

	posts.sort((a, b) => {
		return new Date(b.postInfo.date) - new Date(a.postInfo.date);
	});

	return posts;
};

router.get('/', async (request, response) => {

	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const localeString = reqLocale.toString();

	response.render('blog', {
		layout: 'main',
		locale,
		localeString,
		postList
	});
});

// RSS feed
router.get('/feed.xml', async (request, response) => {

	// Adds the pubDate and the cover_extension to the post array
	const posts = postList().map((post) => {
		post.postInfo.pubDate = new Date(post.postInfo.date).toUTCString();
		post.postInfo.cover_extension = post.postInfo.cover_image.substring(post.postInfo.cover_image.lastIndexOf('.') + 1);
		return post;
	});

	response.set('Content-Type', 'application/rss+xml');
	response.render('blog-rss', {
		layout: false,
		posts
	});
});

router.get('/:slug', async (request, response, next) => {

	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const localeString = reqLocale.toString();

	// Get the name of the post from the URL
	const postName = request.params.slug;

	// Get the markdown file corresponding to the post
	let rawPost;
	try {
		rawPost = fs.readFileSync(path.join('blogposts', `${postName}.md`), 'utf-8');
	} catch(err) {
		logger.error(err);
		next();
		return;
	}
	// Convert the post info into JSON and separate it and the content
	// eslint-disable-next-line prefer-const
	let { data: postInfo, content } = matter(rawPost);

	// Replace [yt-iframe](videoID) with the full <iframe />
	content = content
		.replace(/(?<!`)\[yt-iframe]\(/g, '<div class="aspectratio-fallback"><iframe src="https://www.youtube-nocookie.com/embed/')
		.replace(/(?<=<iframe src="https:\/\/www\.youtube-nocookie\.com\/embed\/.{11})\)/g, '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');

	// Convert the content into HTML
	const htmlPost = marked(content);

	response.render('blogpost', {
		layout: 'main',
		locale,
		localeString,
		postInfo,
		htmlPost,
	});
});

module.exports = router;
