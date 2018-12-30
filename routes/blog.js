/*

blog.js -
file for handling routes regarding blog posts.

*/

// imports
const logger = require('winston');
const router = require('express').Router();
const moment = require('moment');
const apiHelper = require('../helpers/api');
const utilHelper = require('../helpers/util');
const blogPostModel = require('../models/blog-post').blogPostModel;
const postAuthorModel = require('../models/post-author').postAuthorModel;

// display single blog post
router.get('/news/:date/:title', (request, response) => {
	const date = request.params.date;
	const title = request.params.title;
	const title_lower = title.toLowerCase();

	// date format YYYY-MM-DD
	if (/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date) && /([a-z]|[0-9]|-)+/.test(title_lower)) {
		// params are correct format
		blogPostModel.getPost(moment(date), title_lower, (error, post) => {
			// error exists or no post exists with the date and name
			if (error || !post) {
				logger.log('warn', `error: ${error} and post: ${post}`);
				return utilHelper.send404(response);
			}
			
			// render blogpost
			post.postTemplate((error, postTemplate) => {
				if (error) {
					return utilHelper.send404(response);
				}
				
				return response.render('post', {
					title,
					description: 'On the Pretendo Network ID Dashboard you can manage your personal information and make new virtual consoles to use for login on your home console.',
					url: request.protocol + '://' + request.get('host') + request.originalUrl,
					baseurl: request.protocol + '://' + request.get('host'),
					post: postTemplate,
					user: utilHelper.templateReadyUser(request),
					locale: utilHelper.getLocale('US', 'en')
				});
			});
		});
	} else {
		// params are incorrect
		return utilHelper.send404(response);
	}
});

// display latest blogposts
router.get('/news', (request, response) => {
	// sort blogposts on date descending
	blogPostModel.find({}).sort({'meta.date': 'desc'}).exec((error, posts) => {
		if (error || !posts) {
			return utilHelper.send404(response);
		}

		// makes posts template ready
		const postCollection = [];
		for (let i = 0, l = posts.length; i < l; i++) {
			postCollection.push(posts[i].postShortTemplate());
		}

		return response.render('post-collection', {
			title: 'Pretendo | News',
			description: 'The Pretendo news page has a place for all of the update posts the Pretendo developer team has made. It contains everything you need to know about pretendo.',
			url: request.protocol + '://' + request.get('host') + request.originalUrl,
			baseurl: request.protocol + '://' + request.get('host'),
			posts: postCollection,
			user: utilHelper.templateReadyUser(request),
			locale: utilHelper.getLocale('US', 'en'),
			page: 'news'
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
router.get('/api/v1/listauthors', (request, response) => {
	postAuthorModel.find({}, (error, authors) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (error) {
			return apiHelper.sendApiError(response, 500, [error]);
		}

		return apiHelper.sendReturn(response, {
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
router.get('/api/v1/listblog', (request, response) => {
	blogPostModel.find({}, (error, posts) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (error) {
			return apiHelper.sendApiError(response, 500, [error]);
		}
		
		apiHelper.sendReturn(response, {
			postList: posts
		});
	});
});

// export router
module.exports = router;
