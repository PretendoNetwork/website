const path = require('path');
const fs = require('fs-extra');
const { Router } = require('express');
const { marked } = require('marked');
const matter = require('gray-matter');
const logger = require('../logger');

const router = new Router();

async function getPostsList() {
	const files = await fs.readdir('blogposts');

	const filteredFiles = files
		.filter(filename => !filename.startsWith('_')) // Ignore files starting with _
		.filter(filename => filename.endsWith('.md')); // Ignores files that don't end with .md

	const posts = await Promise.all(filteredFiles.map(async (filename) => {
		const slug = filename.replace('.md', '');
		const rawPost = await fs.readFile(
			path.join('blogposts', `${filename}`),
			'utf-8'
		);
		const { data: postInfo } = matter(rawPost);
		return {
			slug,
			postInfo
		};
	}));

	posts.sort((a, b) => {
		return new Date(b.postInfo.date) - new Date(a.postInfo.date);
	});

	return posts;
}

router.get('/', async (request, response) => {
	const postList = await getPostsList();
	const renderData = {
		postList
	};

	response.render('blog/blog', renderData);
});

// RSS feed
router.get('/feed.xml', async (request, response) => {
	const postList = await getPostsList();

	// Adds the pubDate and the cover_extension to the post array
	const posts = postList.map((post) => {
		post.postInfo.pubDate = new Date(post.postInfo.date).toUTCString();
		post.postInfo.cover_extension = post.postInfo.cover_image.substring(post.postInfo.cover_image.lastIndexOf('.') + 1);
		return post;
	});

	response.set('Content-Type', 'application/rss+xml');
	response.render('blog/blog-rss', {
		layout: false,
		posts
	});
});

router.get('/:slug', async (request, response, next) => {
	const renderData = {
		layout: 'blog-opengraph'
	};

	// Get the name of the post from the URL
	const postName = request.params.slug;

	if (!/^[0-9-]+$/.test(postName)) {
		logger.error(`Invalid blog post name name ${postName}`);
		next();
		return;
	}

	// Get the markdown file corresponding to the post
	let rawPost;
	try {
		rawPost = await fs.readFile(path.join('blogposts', `${postName}.md`), 'utf-8');
	} catch (err) {
		logger.error(err);
		next();
		return;
	}
	// Convert the post info into JSON and separate it and the content

	let { data: postInfo, content } = matter(rawPost);
	renderData.postInfo = postInfo;

	// Replace [yt-iframe](videoID) with the full <iframe />
	content = content
		.replace(/(?<!`)\[yt-iframe]\(/g, '<div class="aspectratio-fallback"><iframe src="https://www.youtube-nocookie.com/embed/')
		.replace(/(?<=<iframe src="https:\/\/www\.youtube-nocookie\.com\/embed\/.{11})\)/g, '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');

	// Convert the content into HTML
	const htmlPost = marked.parse(content);
	renderData.htmlPost = htmlPost;

	response.render('blog/blogpost', renderData);
});

module.exports = router;
