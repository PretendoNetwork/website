const { Router } = require('express');
const router = new Router();

router.get('/', (request, response) => {
	res.redirect('/#faq');
});

module.exports = router;
