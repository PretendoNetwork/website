const { Router } = require('express');
const router = new Router();

router.get('/', (_req, res) => {
	res.redirect('/#faq');
});

module.exports = router;
