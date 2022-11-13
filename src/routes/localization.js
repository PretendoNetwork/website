const { Router } = require('express');
const router = new Router();

router.get('/', async (request, response) => {
	response.redirect('https://hosted.weblate.org/projects/pretendonetwork/');
});

module.exports = router;
