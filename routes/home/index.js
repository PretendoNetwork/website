let routes = require('express').Router();

/**
 * [GET]
 * Description: Root of site
 */
routes.get('/', (request, response) => {
    response.render('home');
});

module.exports = routes;