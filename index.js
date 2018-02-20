//////////////////////////////////////////////////////////////////
///                                                            ///
///                        Dependencies                        ///
///                                                            ///
//////////////////////////////////////////////////////////////////

let port = 80,
    path = require('path'),
    express = require('express'),
    pug = require('pug'),
    colors = require('colors'),
    morgan = require('morgan'),
    app = express(),
    api_router = express.Router();

// Routes
const ROUTES = {
    HOME: require('./routes/home'),
}

// START APPLICATION
app.set('etag', false);
app.use(express.static(__dirname + '/assets'));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Views
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.engine('pug', pug.__express);

// Setup routes
app.use('/', ROUTES.HOME); // Root

// 404 handler
app.use((request, response) => {
    response.status(404);
    response.send();
});

// non-404 error handler
app.use((error, request, response) => {
    let status = error.status || 500;
    response.status(status);
    response.json({
        app: 'api',
        status: status,
        error: error.message
    });
});

// Starts the server
app.listen(port, () => {
    console.log('Server'.blue + ' started '.green.bold + 'on port '.blue + new String(port).yellow);
});
