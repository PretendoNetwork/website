const path = require('path');
const fs = require('fs-extra');
const { Router } = require('express');
const { marked } = require('marked');
const matter = require('gray-matter');
const logger = require('../logger');

const router = new Router();

router.get('/:slug', async (request, response, next) => {
	const renderData = {
		layout: 'blog-opengraph'
	};

	const termName = request.params.slug;

	if (!/^[a-z]+$/.test(termName)) {
		logger.error(`Invalid term name ${termName}`);
		next();
		return;
	}

	let rawTerm;
	try {
		rawTerm = await fs.readFile(path.join('terms', `${termName}.md`), 'utf-8');
	} catch (err) {
		logger.error(err);
		next();
		return;
	}

	const { data: termInfo, content } = matter(rawTerm);
	renderData.termInfo = termInfo;

	const htmlPost = marked.parse(content);
	renderData.htmlPost = htmlPost;

	response.render('terms/term', renderData);
});

module.exports = router;
