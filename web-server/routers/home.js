
const { Router } = require("express");
const router = new Router();

router.get("/", (req, res) => {

	const tmpLocale = {
		// TODO
		nav: {
			about: "About",
			faq: "Faq",
			credits: "Credits"
		},
		hero: {
			subtitle: "Game servers",
			title: "Recreated", // No dot here.
			text: "An open source project that aims to recreate all Nintendo servers for 3DS and WiiU. This way the services can persist after officially killed by Nintendo.",
			buttons: {
				readMore: "Read more"
			}
		},
		section2: {
			left: {
				title: "About us",
				paragraphs: [
					"We are a bunch of programmers spending our free time reverse engineering and coding game servers for 3DS and WiiU",
					"An open source project that aims to recreate all Nintendo servers for 3DS and WiiU. This way the services can persist after they are officialy killed by Nintendo"
				]
			},
			right: {
				title: "Progress",
				paragraphs: [
					"Now what are the possibilities of warp drive? Hello world, this is just s'more text. Hello hello world world hello! Some.",
					"10.000 luchtballonnen, kleuren de hemel blauw. 10.000 luchtballonnen, zijn op weg naar jou. 10.000 luchtballonnen, kleuren de horizon."
				]
			}
		},
		faq: {
			title: "Answered questions",
			text: "This is where some text about the questions would go, however jvs didn't write copy for it. So now I have to write this.",
			QAs: [
				{
					"question": "What is Pretendo?",
					"answer": "Pretendo is an open source Nintendo Network replacement that aims to build custom servers for the WiiU and 3DS family of consoles. Our goal is to preserve the online functionality of these consoles, to allow players to continue to play their favorite WiiU and 3DS games to their fullest capacity"
				},
				{
					"question": "Will my existing NNIDs work on Pretendo?",
					"answer": "Sadly, no. The only ones with access to the data about your existing NNIDs is Nintendo. A NNID-to-PNID migration could theoretically be possible, but it would be a slow and lengthy process requiring sensitive user information"
				},
				{
					"question": "How do I use Pretendo?",
					"answer": "Pretendo is currently not in a state that is ready for public use. However, once it is you will be able to use Pretendo simply by running our homebrew patcher on your console"
				},
				{
					"question": "Is there an ETA for XYZ?",
					"answer": "We do not have an exact ETA for any specific features or the project as a whole. There are many parts to the network, updates release for them individually whenever they are ready (for example updates to the account server are (almost always) independent on other parts of the network, such as the friends server). Due to that we cannot give an exact ETA"
				},
				{
					"question": "Does Pretendo work on Cemu/emulators?",
					"answer": "Pretendo is designed for the WiiU and (eventually) 3DS. At this time the only emulator for these consoles with real online capability is Cemu. Cemu does not officially support custom servers, but it will still be possible to use Pretendo with Cemu<br>See the <a href=\"/cemu\">Cemu</a> page for more details"
				},
				{
					"question": "If I am account/console banned on Nintendo Network, will I stay banned when using Pretendo?",
					"answer": "Any account/console bans only exist server-side. This means any existing bans would not carry over to Pretendo. However Pretendo still reserves the right to issue a ban for our network if we see fit"
				},
				{
					"question": "Will Pretendo support the Wii/Switch?",
					"answer": "The Wii already has custom servers provided by <a href=\"https://wiimmfi.de/\" target=\"_blank\">Wiimmfi</a>. We currently have no plans on supporting the Switch, as not only is it a completely different platform with a different online network, but Switch online is a paid service"
				},
				{
					"question": "Do I need Haxchi to run the patcher?",
					"answer": "No. The only thing you need to run the patcher is a way to access the Homebrew Launcher, whether it's the browser exploit, Haxchi or Coldboot Haxchi"
				}
			]
		},
		credits: {
			title: "The team",
			text: "Our amazing team has spent countless hours helping out on making Pretendo better.",
			people: [
				{
					"name": "Jonathan Barrow (RedDucks)",
					"caption": "Project owner and lead developer",
					"picture": "https://github.com/redduckss.png",
					"github": "https://github.com/RedDuckss"
				},
				{
					"name": "Jemma (CaramelKat)",
					"caption": "Miiverse research and development",
					"picture": "https://github.com/caramelkat.png",
					"github": "https://github.com/CaramelKat"
				},
				{
					"name": "superwhiskers",
					"caption": "crunch library development",
					"picture": "https://github.com/superwhiskers.png",
					"github": "https://github.com/superwhiskers"
				},
				{
					"name": "SuperMarioDaBom",
					"caption": "Console and other system research",
					"picture": "https://github.com/supermariodabom.png",
					"github": "https://github.com/SuperMarioDaBom"
				},
				{
					"name": "Rambo6Glaz",
					"caption": "Network installer and console research",
					"picture": "https://github.com/NexoDevelopment.png",
					"github": "https://github.com/NexoDevelopment"
				},
				{
					"name": "mrjvs",
					"caption": "Web development and early eShop research",
					"picture": "https://github.com/mrjvs.png",
					"github": "https://github.com/mrjvs"
				},
				{
					"name": "Benjamin Moss (kxpler442b)",
					"caption": "Web development",
					"picture": "https://github.com/kxpler442b.png",
					"github": "https://github.com/kxpler442b"
				},
				{
					"name": "Jip Fr",
					"caption": "Web development",
					"picture": "https://github.com/jipfr.png",
					"github": "https://github.com/jipfr"
				},
				{
					"name": "Kinnay",
					"caption": "None of this would be possible without the research and help done by Kinnay on PRUDP and nex",
					"picture": "https://cdn.discordapp.com/avatars/186572995848830987/b55c0d4e7bfd792edf0689f83a25d8ea.png?size=2048",
					"github": "https://github.com/Kinnay"
				}
			]
		}
	}

	res.render("home", {
		layout: "main",
		locale: tmpLocale
	});
})

module.exports = router;