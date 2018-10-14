/*

blog.js -
file for handling routes regarding blog posts.

*/

// imports
const router = require('express').Router();
const common = require('../helpers/common');
const blogPostModel = require('../models/blog-post').blogPostModel;
const postAuthorModel = require('../models/post-author').postAuthorModel;

// display single blog post
router.get('/news/:date/:title', (req, res) => {
	// date format DD-MM-YYY
	if (/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(req.params.date) && /([a-z]|[0-9]|-)+/.test(req.params.title.toLowerCase())) {
		// params are correct format
		blogPostModel.getPost(new Date(req.params.date), req.params.title.toLowerCase(), (err, post) => {
			// error exists or no post exists with the date and name
			if (err || !post) {
				console.log('error: ' + err + ' and post: ' + post);
				return common.sendDefault404(res);
			}
			
			// render blogpost
			post.getBlogPostTemplateReady((err, postTemplate) => {
				if (err) return common.sendDefault404(res);
				res.render('post', {
					post: postTemplate
				});
			});
		});
	} else {
		// params are incorrect
		common.sendDefault404(res);
	}
});

// display latest blogposts
router.get('/news', (req, res) => {
	blogPostModel.find({}).sort({'meta.date': 'desc'}).exec(function(err, posts) {
		if (err || !posts) {
			return common.sendDefault404(res);
		}

		const postCollection = [];
		for (let i = 0, l = posts.length; i < l; i++) {
			postCollection.push(posts[i].getBlogPostShortTemplateReady());
		}

		res.render('post-collection', {
			posts: postCollection
		});
	});
});

/* 
*	/api/v1/listauthors
*
*	gets a list of all authors
*
*	return {
*		code: http code
*		success: boolean - true if author succesfull
*		authorList: Objects[{_id, name, description, image}] - list of authors with information
*		errors: Strings[messages]
*	}
*/
router.get('/api/v1/listauthors', function (req, res) {
	postAuthorModel.find({}, (err, authors) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (err) return common.sendApiError(res, 500, [err]);
		common.sendApiReturn(res, {
			authorList: authors
		});
	});
});

/* 
*	/api/v1/listblog
*
*	gets a list of all posts
*
*	return {
*		code: http code
*		success: boolean - true if post succesfull
*		postList: Objects[{_id, content, meta}] - list of posts with information
*		errors: Strings[messages]
*	}
*/
router.get('/api/v1/listblog', function (req, res) {
	blogPostModel.find({}, (err, posts) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (err) return common.sendApiError(res, 500, [err]);
		common.sendApiReturn(res, {
			postList: posts
		});
	});
});

// export router
module.exports = router;
