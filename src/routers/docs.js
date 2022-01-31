const { Router } = require('express');
const util = require('../util');
const router = new Router();

const fs = require('fs');
const path = require('path');
const marked = require('marked');

router.get('/', async (request, response) => {
	response.redirect('/docs/welcome');
});

router.get('/search', async (request, response) => {
	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	const localeString = reqLocale.toString();

	response.render('docs/search', {
		layout: 'main',
		locale,
		localeString,
		currentPage: 'search',
	});
});

router.get('/search/:searchingWord', async (request, response) => {
	const reqLocale = request.locale;

	const searchingWord = request.params.searchingWord;
	const localeString = reqLocale.toString();
	const c = fs.readdirSync(`${__dirname}/../../docs/${localeString}`);
	var arraySent = [];
	for (var i = 0;i < c.length;i++){
		let file = fs.readFileSync(`${__dirname}/../../docs/${localeString}/${c[i]}`,{encoding: "utf8"});
		if (file.includes(searchingWord)){
			arraySent.push(c[i])
		}
	}
	response.json({"ResopnseArray": arraySent});
	return;
});

router.get('/:slug', async (request, response, next) => {
	const reqLocale = request.locale;
	const locale = util.getLocale(reqLocale.region, reqLocale.language);

	var localeString = util.getLocaleFileName(reqLocale.toString().slice(0,2)).replace(".json","");

	// Get the name of the page from the URL
	const pageName = request.params.slug;

	let markdownLocale = localeString;
	let missingInLocale = false;
	// Check if the MD file exists in the user's locale, if not try en-US and show notice, or finally log error and show 404.
	if (fs.existsSync(path.join('docs', localeString, `${pageName}.md`))) {
		null;
	} else if (fs.existsSync(path.join('docs', 'en-US', `${pageName}.md`))) {
		markdownLocale = 'en-US';
		missingInLocale = true;
	} else {
		next();
		return;
	}

	let content;
	// Get the markdown file corresponding to the page.
	content = fs.readFileSync(path.join('docs', markdownLocale, `${pageName}.md`), 'utf-8');

	// Replace [yt-iframe](videoID) with the full <iframe />
	content = content
		.replace(/(?<!`)\[yt-iframe]\(/g, '<div class="aspectratio-fallback"><iframe src="https://www.youtube-nocookie.com/embed/')
		.replace(/(?<=<iframe src="https:\/\/www\.youtube-nocookie\.com\/embed\/.{11})\)/g, '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');

	// Convert the content into HTML
	content = marked.parse(content);

	// A boolean to show the quick links grid or not.
	let showQuickLinks = false;
	if (pageName === 'welcome') {
		showQuickLinks = true;
	}

	response.render('docs/docs', {
		layout: 'main',
		locale,
		localeString,
		content,
		currentPage: request.params.slug,
		missingInLocale,
		showQuickLinks
	});
});

module.exports = router;
