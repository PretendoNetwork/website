const { Router } = require('express');
const util = require('../util');
const router = new Router();

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

router.get('/', async (request, response) => {
	response.redirect('/docs/welcome');
});

router.get('/search', async (request, response) => {
	const renderData = 	{
		currentPage: request.params.slug
	};

	renderData.isLoggedIn = request.cookies.access_token && request.cookies.refresh_token && request.cookies.ph;

	if (renderData.isLoggedIn) {
		const account = await util.getAccount(request, response);
		renderData.account = account;
	}

	response.render('docs/search', renderData);
});

router.get('/:slug', async (request, response, next) => {
	const renderData = 	{
		currentPage: request.params.slug
	};

	renderData.isLoggedIn = request.cookies.access_token && request.cookies.refresh_token && request.cookies.ph;

	if (renderData.isLoggedIn) {
		const account = await util.getAccount(request, response);
		renderData.account = account;
	}

	// Get the name of the page from the URL
	const pageName = request.params.slug;

	let markdownLocale = response.locals.localeString;
	let missingInLocale = false;
	// Check if the MD file exists in the user's locale, if not try en-US and show notice, or finally log error and show 404.
	if (fs.existsSync(path.join('docs', markdownLocale, `${pageName}.md`))) {
		null;
	} else if (fs.existsSync(path.join('docs', 'en-US', `${pageName}.md`))) {
		markdownLocale = 'en-US';
		missingInLocale = true;
	} else {
		next();
		return;
	}
	renderData.missingInLocale = missingInLocale;

	let content;
	// Get the markdown file corresponding to the page.
	content = fs.readFileSync(path.join('docs', markdownLocale, `${pageName}.md`), 'utf-8');

	// Replace [yt-iframe](videoID) with the full <iframe />
	content = content
		.replace(/(?<!`)\[yt-iframe]\(/g, '<div class="aspectratio-fallback"><iframe src="https://www.youtube-nocookie.com/embed/')
		.replace(/(?<=<iframe src="https:\/\/www\.youtube-nocookie\.com\/embed\/.{11})\)/g, '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');

	// Convert the content into HTML
	content = marked.parse(content);
	renderData.content = content;

	// A boolean to show the quick links grid or not.
	let showQuickLinks = false;
	if (pageName === 'welcome') {
		showQuickLinks = true;
	}
	renderData.showQuickLinks = showQuickLinks;

	response.render('docs/docs', renderData);
});

module.exports = router;
