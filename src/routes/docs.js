const path = require('node:path');
const fs = require('node:fs');
const { Router } = require('express');
const errors = require('@pretendonetwork/error-codes');
const util = require('../util');

const errorList = errors.getAllErrors();
const router = new Router();

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

router.get([
	'/search', // TODO - Deprecate search page
	'/errors',
], async (_request, response) => {
	const renderData = {
		errorList: JSON.stringify(errorList),
		currentPage: 'errors',
	};

	response.render('docs/search', renderData);
});

router.get('/error', async (_request, response) => {
	response.redirect(301, '/docs/errors');
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

router.get([
	'/errors/:errorCode', // TODO - Deprecate search errors route
	'/error/:errorCode',
], async (request, response, next) => {
	const locale = response.locals.localeString;
	const error = request.params.errorCode;

	const [ sysmodule, errorCode ] = error.split('-');

	if (!errorCode) {
		return next();
	}

	let template = fs.readFileSync(path.join(__dirname, '../../docs/common/error-page-template.md'), {
		encoding: 'utf8'
	});

	const errorInfo = errors.getErrorInfo(sysmodule, errorCode, locale);

	if (!errorInfo) {
		return next();
	}

	template = template.replace('{module}', sysmodule);
	template = template.replace('{code}', errorCode);
	template = template.replace('{system}', errorInfo.module.system);
	template = template.replace('{message}', errorInfo.message.replace(/\s\s+/g, ' '));
	template = template.replace('{description}', errorInfo.long_description);
	template = template.replace('{solution}', errorInfo.long_solution);

	response.render('docs/docs', {
		content: util.parseDocs(template),
		currentPage: 'errors'
	});
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
