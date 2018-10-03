/*

blog.js -
file for handling routes regarding blog posts.

*/

// import express' router
const router = require('express').Router();
const blogHelper = require("../helpers/blog-helper.js");

// display blog post
router.get('/news/:id', async (req, res) => {

    if (isNaN(req.params.id)) {
        res.statusCode = 404;
        res.render("404");
        return;
    }

    const hbsObject = blogHelper.getBlogPostExpressReady(req.params.id);

    if (!hbsObject) {
        res.statusCode = 404;
        res.render("404");
        return;
    }

	res.render('post', hbsObject);
});

// export the router
module.exports = router;
