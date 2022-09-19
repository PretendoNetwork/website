const { Router } = require('express');
const router = new Router();
const util = require('../util');

const errorList = require('../../docs/common/errorList.json');

router.get('/', async (request, response) => {
	response.redirect('/docs/welcome');
});

router.get('/welcome', async (request, response) => {
	const renderData = {
		currentPage: 'welcome',
	};

	response.render('docs/welcome', renderData);
});

router.get('/install', async (request, response) => {
	const renderData = {
		currentPage: 'install',
	};

	response.render('docs/install', renderData);
});

router.get('/search', async (request, response) => {
	const renderData = {
		errorList: JSON.stringify(errorList),
		currentPage: 'search',
	};
	response.render('docs/search', renderData);
});

router.get('/:page', async (request, response, next) => {
	const renderData = 	{};

	const locale = response.locals.localeString;
	const pageName = request.params.page;
	renderData.currentPage = pageName;

	const { content, MDLocale } = util.getRawDocs(locale, '', pageName);
	if (content) {
		renderData.content = content;
	} else {
		return next();
	}
	renderData.missingInLocale = locale !== MDLocale;

	response.render('docs/docs', renderData);
});

router.get('/:subpath/:page', async (request, response, next) => {
	const locale = response.locals.localeString;
	const pageName = request.params.page;
	const subpath = request.params.subpath;

	const renderData = {
		currentPage: `${subpath}/${pageName}`
	};

	const { content, MDLocale } = util.getRawDocs(locale, subpath, pageName);

	if (content) {
		renderData.content = content;
	} else {
		return next();
	}
	
	renderData.missingInLocale = locale !== MDLocale;

	response.render('docs/docs', renderData);
});

module.exports = router;
