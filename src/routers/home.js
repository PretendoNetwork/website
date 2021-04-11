const getLocale = require('../../util/getLocale');
const { Router } = require('express');
const router = new Router();

const pgoressLists = require('../progress-lists');

router.get('/', (req, res) => {
	const tmpLocale = getLocale('US', 'en');
	res.render('home', {
		layout: 'main',
		locale: tmpLocale,
		featuredFeatureList: pgoressLists[0]
	});
});

module.exports = router;
