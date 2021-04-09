const getLocale = require('../../util/getLocale');
const { Router } = require('express');
const router = new Router();

router.get('/', (req, res) => {
	const tmpLocale = getLocale('US', 'en');
	res.render('home', {
		layout: 'main',
		locale: tmpLocale,
		featuredFeatureList: {
			title: 'Thing',
			features: [
				{
					name: 'Feature A', 
					checked: true
				},
				{
					name: 'Feature B', 
					checked: false
				}
			]
		}
	});
});

module.exports = router;
