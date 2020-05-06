
const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {

	const myLocale = {
		// TODO
	}

	res.render("home", {
		layout: "main",
		locale: myLocale
	});
})

module.exports = router;