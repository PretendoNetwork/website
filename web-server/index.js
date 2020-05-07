const express = require("express");
const handlebars = require("express-handlebars");

const cfg = require("../config.json");

const app = express();

const routers = {
	home: require("./routers/home")
}

app.use("/", routers.home);

app.engine("handlebars", handlebars({
	helpers: {
		doFaq(value, options) {
			let htmlLeft = "";
			let htmlRight = "";
			for(let [i, v] of Object.entries(value)) {
				let appendHtml = options.fn({
					...v
				}); // Tis is an HTML string
				if(i % 2 === 0) {
					htmlLeft += appendHtml;
				} else {
					htmlRight += appendHtml;
				}
			}
			return `
			<div class="left questions-left">
				${htmlLeft}
			</div>
			<div class="right questions-right">
				${htmlRight}
			</div>
			`;
		}
	}
}));
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.listen(cfg.http.port);