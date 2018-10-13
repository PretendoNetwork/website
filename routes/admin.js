/*

admin.js -
file for handling admin panel routes

*/

// imports
const router = require('express').Router();
const passport = require('passport');
const common = require('../helpers/common');
const adminUserMiddleware = require('../middleware/admin-authentication');
const adminUser = require('../models/admin-user');
const blogPost = require('../models/blog-post');

// display admin panel
router.get('/admin', (req, res) => {
	res.render('admin');
});

/* 
*	/admin/api/v1/login
*
*	signs admin user in
*
*	post {
*		username - username of admin account
*		password - password of admin account
*	}
*	return {
*		code: http code
*		success: boolean - true if login succesfull
*		username: undefined | string - username if login was successfull
*		role: undefined | string - role of user if login was successfull
*		errors: Strings[messages] - not yet :(
*	}
*/
// TODO make login somehow display errors in correct format.
router.post('/admin/api/v1/login', passport.authenticate('adminUserStrategy'), function (req, res) {
	common.sendApiReturn(res, {
		username: req.user.username,
		role: req.user.role ? req.user.role : undefined
	});
});

/* 
*	/admin/api/v1/register
*	- requires admin auth
*
*	registers a new admin user
*
*	post {
*		username - username of new admin account
*		password - password of new admin account
*	}
*	return {
*		code: httpcode
*		success: boolean - true if register was successull
*		username: undefined | string - username if register was successfull
*		role: undefined | string - role of user if register was successfull
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/register', adminUserMiddleware.adminAuthenticationRequired, (req, res) => {
	if (!req.body) {
		// no post body
		common.sendApiGenericError(res);
		return;
	}

	const { username, password } = req.body;
	const newUser = new adminUser.adminUserModel({
		username,
		password
	});
	
	newUser.save().then(() => {
		// successfull
		common.sendApiReturn(res, {
			username: req.user.username,
			role: req.user.role ? req.user.role : undefined
		});
		return;
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		common.sendApiError(res, 500, [rejection]);
		return;
	});
});

/* 
*	/admin/api/v1/check
*
*	checks if admin logged in
*
*	return {
*		code: httpcode
*		success: boolean - true if request was without errors
*		isAuthed: boolean - true if logged in
*		role: undefined | string - returns user role
*		errors: Strings[messages]
*	}
*/
router.get('/admin/api/v1/check', adminUserMiddleware.authenticationOptional, (req, res) => {
	common.sendApiReturn(res, {
		isAuthed: req.user ? true : false,
		role: req.user ? (req.user.role ? req.user.role : undefined) : undefined
	});
});

/* 
*	/admin/api/v1/logout
*
*	logs out admin user
*
*	return {
*		code: httpcode
*		success: boolean - true if logout is successfull
*		errors: Strings[messages]
*	}
*/
router.get('/admin/api/v1/logout', adminUserMiddleware.adminAuthenticationRequired, (req, res) => {
	req.logout();
	common.sendApiReturn(res, {});
});

/* 
*	/admin/api/v1/newpost
*
*	posts a new blog post
*
*	post {
*		content - content of the blog post in markdown
*		title - title of the blog post
*		author - id of the author
*		category - category name of the blog post
*		
*	}
*	return {
*		code: http code
*		success: boolean - true if login succesfull
*		url: string | undefined - url of the blog post if successfull
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/newpost', adminUserMiddleware.adminAuthenticationRequired, function (req, res) {
	
	if (!req.body) return common.sendApiGenericError(res);

	const { content, title, author, category } = req.body;
	const newBlogPost = new blogPost.blogPostModel({
		content: blogPost.blogPostModel.convertMarkdownToHtml(content),
		name: title,
		meta: {
			author,
			category,
			urlTitle: title
				.trim()
				.replace(/\s/g, '-')
				.replace(/[^A-z0-9-]/g, '')
				.toLowerCase()
		}
	});
	
	newBlogPost.save().then((post) => {
		// successfull
		common.sendApiReturn(res, {
			url: common.convertDateToString(post.meta.date) + '/' + post.meta.urlTitle
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		common.sendApiError(res, 500, [rejection]);
		return;
	});
});

// configure api 404
router.use('/admin/api', (req, res) => {
	common.sendApi404(res);
});

// export the router
module.exports = router;
