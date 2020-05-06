const express = require("express");
const handlebars = require("express-handlebars");

const cfg = require("../config.json");

const app = express();

const routers = {
	home: require("./routers/home")
}

app.use("/", routers.home);

app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.listen(cfg.http.port);