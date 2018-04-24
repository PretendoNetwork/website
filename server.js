/*

server.js -
the file that contains the code to run the server

*/

// module imports, and
// some important variable defs
const 	express     = require("express"),
		handlebars  = require("express-handlebars"),
		config      = require("./config.json"),
		app         = express()

// import the colors module
require("colors")

// locations for some files
const locations = {

	home: require("./routes/home"),

}

// load the handlebars module
app.engine(".hbs", handlebars({

        extname: ".hbs",
        layoutsDir: "views",
		partialsDir: "views/partials"
		
}))

// set express to use handlebars
// as the templating engine
app.set("view engine", ".hbs")

// set some routes on the server

// assets folder serving
app.use("/assets", express.static("assets"))

// website root
app.use('/', locations.home)

// send a 404 on a file not
// being found
app.use((req, res) => {

	// set the status to that
	// of a 404
	res.status("404")

	// send the 404 template
	res.render("404")

})

// start the server
app.listen(config.http.port, () => {

	console.log(`started the server on port: ${ new String(config.http.port).green }`)

})
