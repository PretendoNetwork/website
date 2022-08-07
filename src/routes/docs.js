const { Router } = require('express');
const router = new Router();

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const errorList = require('../../docs/common/errorList.json');

router.get('/', async (request, response) => {
	response.redirect('/docs/welcome');
});

router.get('/search', async (request, response) => {
	const renderData = {
		errorList: JSON.stringify(errorList),
		currentPage: 'search',
	};
	response.render('docs/search', renderData);
});

router.get('/install', async (request, response) => {
	const renderData = 	{
		currentPage: 'install',
	};

	response.render('docs/install', renderData);
});

function getRawDocs(locale, subpath, pageName) {

	const localePath = path.join(__dirname, '../../docs', locale, subpath, `${pageName}.md`);
	const defaultPath = path.join(__dirname, '../../docs', 'en-US', subpath, `${pageName}.md`);

	if (fs.existsSync(localePath)) {
		return {
			content: parseDocs(fs.readFileSync(localePath, 'utf8')),
			MDLocale: locale,
		};
	} else if (fs.existsSync(defaultPath)) {
		return {
			content: parseDocs(fs.readFileSync(defaultPath, 'utf8')),
			MDLocale: 'en-US'
		};
	} else {
		return {
			content: null,
			MDLocale: null
		};
	}
}

function parseDocs(rawDocs) {
	if (rawDocs) {
		let markedContent = marked(rawDocs);
		markedContent = markedContent.replaceAll(/\[yt-iframe\]\(.{11}\)/g, (match) => {
			const videoIDRegex = /(?<=\[yt-iframe\]\().*(?=\))/g;
			const videoID = match.match(videoIDRegex)[0];
			return `<div class="aspectratio-fallback"><iframe src="https://www.youtube-nocookie.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
		});

		const htmlContent = marked.parse(markedContent);
		return htmlContent;
	} else {
		return null;
	}
}

router.get('/:page', async (request, response, next) => {
	const renderData = 	{};

	const locale = response.locals.localeString;
	const pageName = request.params.page;
	renderData.currentPage = pageName;

	const { content, MDLocale } = getRawDocs(locale, '', pageName);
	if (content) {
		renderData.content = content;
	} else {
		return next();
	}
	renderData.missingInLocale = locale !== MDLocale;

	// A boolean to show the quick links grid or not.
	if (pageName === 'welcome') {
		renderData.showQuickLinks = true;
	}

	response.render('docs/docs', renderData);
});
router.get('/:subpath/:page', async (request, response, next) => {
	const renderData = 	{};

	const locale = response.locals.localeString;
	const pageName = request.params.page;
	const subpath = request.params.subpath;
	renderData.currentPage = `${subpath}/${pageName}`;

	const { content, MDLocale } = getRawDocs(locale, subpath, pageName);
	if (content) {
		renderData.content = content;
	} else {
		return next();
	}
	renderData.missingInLocale = locale !== MDLocale;

	response.render('docs/docs', renderData);
});

module.exports = router;
