const { Router } = require('express');
const router = new Router();

router.get('/', (request, response) => {
	response.redirect('/#faq');
});

module.exports = router;
