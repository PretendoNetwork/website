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
const postAuthor = require('../models/post-author');
const progressList = require('../models/progress-list');

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
*		short - short description of content in plain text
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

	const { content, title, author, category, short } = req.body;
	const newBlogPost = new blogPost.blogPostModel({
		content: blogPost.blogPostModel.convertMarkdownToHtml(content),
		name: title,
		short,
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

/* 
*	/admin/api/v1/editpost
*
*	edits a blog post
*
*	post {
*		id - id of the blog post to be edited
*		content - content of the blog post IN HTML
*		title - title of the blog post
*		author - id of the author
*		short - short description of content in plain text
*		category - category name of the blog post
*	}
*	return {
*		code: http code
*		success: boolean - true if login succesfull
*		url: string | undefined - url of the blog post if successfull
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/editpost', adminUserMiddleware.adminAuthenticationRequired, function (req, res) {
	
	if (!req.body) return common.sendApiGenericError(res);

	const { id, content, title, author, category, short } = req.body;
	blogPost.blogPostModel.findByIdAndUpdate(id, {
		'content': content,
		'name': title,
		'short': short,
		'meta.author': author,
		'meta.category': category
	}, (err, post) => {
		if (err) return common.sendApiError(res, 500, [err]);
		common.sendApiReturn(res, {
			url: common.convertDateToString(post.meta.date) + '/' + post.meta.urlTitle
		});
	});
});

/* 
*	/admin/api/v1/newauthor
*
*	creates new author
*
*	post {
*		name - author name
*		description - author description
*		image - image url for profile picture
*	}
*	return {
*		code: http code
*		success: boolean - true if author succesfull
*		id: string | undefined - id of the new author if successfull
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/newauthor', adminUserMiddleware.adminAuthenticationRequired, function (req, res) {
	
	if (!req.body) return common.sendApiGenericError(res);

	const { name, description, image } = req.body;
	const newAuthor = new postAuthor.postAuthorModel({
		name,
		description,
		image
	});
	
	newAuthor.save().then((author) => {
		// successfull
		common.sendApiReturn(res, {
			id: author.id
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		common.sendApiError(res, 500, [rejection]);
		return;
	});
});

/* 
*	/admin/api/v1/editauthor
*
*	edit an existing author
*
*	post {
*		id - id of author to edit
*		name - author name
*		description - author description
*		image - image url for profile picture
*	}
*	return {
*		code: http code
*		success: boolean - true if author succesfull
*		id: String - id of the edited author
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/editauthor', adminUserMiddleware.adminAuthenticationRequired, function (req, res) {
	
	if (!req.body) return common.sendApiGenericError(res);

	const { id, name, description, image } = req.body;

	postAuthor.postAuthorModel.findByIdAndUpdate(id, {
		name,
		description,
		image
	}, (err, author) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (err) return common.sendApiError(res, 500, [err]);
		common.sendApiReturn(res, {
			id: author.id
		});
	});
});

/* 
*	/admin/api/v1/newprogress
*
*	creates a new progress entry
*
*	post {
*		title - progress entry name
*		description - progress entry description
*		state - 0: backend service entry, 1: no support, 2: partial support, 3: fullly working
*	}
*	return {
*		code: http code
*		success: boolean - true if progress succesfull
*		id: String | undefined - sends if successfull
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/newprogress', adminUserMiddleware.adminAuthenticationRequired, function (req, res) {
	
	if (!req.body) return common.sendApiGenericError(res);

	const { title, description } = req.body;
	let { state } = req.body;
	let isGame = false;
	if (state != '1' && state != '2' && state != '3') {
		state = undefined;
	} else {
		state = parseInt(state);
		isGame = true;
	}

	const newProgress = new progressList.progressListModel({
		title,
		description,
		isGame,
		state
	});
	
	newProgress.save().then((progress) => {
		// successfull
		common.sendApiReturn(res, {
			id: progress.id
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		common.sendApiError(res, 500, [rejection]);
		return;
	});
});

/* 
*	/admin/api/v1/editprogress
*
*	edit an existing progress entry
*
*	post {
*		title - progress entry name
*		description - progress entry description
*		state - 0: backend service entry, 1: no support, 2: partial support, 3: fullly working
*		id - id of entry you want to edit
*	}
*	return {
*		code: http code
*		success: boolean - true if progress succesfull
*		id: String - id of the edited progress entry
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/editprogress', adminUserMiddleware.adminAuthenticationRequired, function (req, res) {
	
	if (!req.body) return common.sendApiGenericError(res);

	const { title, description, id } = req.body;
	let { state } = req.body;
	let isGame = false;
	if (state != '1' && state != '2' && state != '3') {
		state = undefined;
	} else {
		state = parseInt(state);
		isGame = true;
	}

	progressList.progressListModel.findByIdAndUpdate(id, {
		title,
		description,
		state,
		isGame
	}, (err, progress) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (err) return common.sendApiError(res, 500, [err]);
		common.sendApiReturn(res, {
			id: progress.id
		});
	});
});

// configure api 404
router.use('/admin/api', (req, res) => {
	common.sendApi404(res);
});

// export the router
module.exports = router;
