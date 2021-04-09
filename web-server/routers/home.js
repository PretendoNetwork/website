const getLocale = require('../../util/getLocale');
const { Router } = require('express');
const router = new Router();

const featureLists = require('../../feature-lists.json');

router.get('/', (req, res) => {
	const tmpLocale = getLocale('US', 'en');
	res.render('home', {
		layout: 'main',
		locale: tmpLocale,
		featuredFeatureList: featureLists[0]
	});
});

module.exports = router;
