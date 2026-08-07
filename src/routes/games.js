const { Router } = require('express');
const router = new Router();

router.get('/', async (request, response) => {
	const renderData = {
		announcement: "<b>April 17</b>: Due to extremely high load, most servers are unstable. You may not be able to connect, even to services shown as Online. Please be patient while we make upgrades!",
		games: {
			"Friends": "online",
			"Juxtaposition (Miiverse)": "tester",
			"Mario Kart 8": "online",
			"Splatoon": "online",
			"Minecraft: Wii U Edition": "tester",
			"Animal Crossing: New Leaf": "offline",
			"Super Smash Bros: Wii U": "offline",
		}
	}

	response.render('games', renderData);
});

module.exports = router;