const getLocale = require('../../util/getLocale');
const { Router } = require('express');
const router = new Router();

const progressLists = require('../../progress-lists.json');

router.get('/', (req, res) => {
	const tmpLocale = getLocale('US', 'en');
	res.render('progress', {
		layout: 'main',
		locale: tmpLocale,
		progressLists
	});
});

module.exports = router;
