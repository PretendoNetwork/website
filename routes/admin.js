/*

admin.js -
file for handling admin api.

*/

// imports
const router = require('express').Router();
const passport = require('passport');
const moment = require('moment');
const apiHelper = require('../helpers/api');
const userMiddleware = require('../middleware/authentication');

// database models
const adminUser = require('../models/admin-user');
const blogPost = require('../models/blog-post');
const postAuthor = require('../models/post-author');
const progressList = require('../models/progress-list');

// renders admin.hbs
router.get('/admin', (request, response) => {
	response.render('admin', {
		title: 'Pretendo | Admin',
	});
});

/* 
*	/admin/api/v1/login
*
*	signs admin user in
*
*	post {
*		username
*		password
*	}
*	return {
*		code: http code
*		success: boolean
*		username: undefined | string - only if login was successfull
*		role: undefined | string - role of user if login was successfull
*		errors: Strings[messages] - not yet :(
*	}
*/
// TODO make login somehow display errors in correct format.
// middleware does the authentication work. this just returns a success
router.post('/admin/api/v1/login', passport.authenticate('adminUserStrategy'), (request, response) => {
	const user = request.user;

	return apiHelper.sendReturn(response, {
		username: user.username,
		locale: user.getLocale(), // calls 'utilHelper.getLocale(user.region, user.language)' maybe?
		role: user.role ? user.role : undefined
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
router.post('/admin/api/v1/register', userMiddleware.adminAuthNeeded, (request, response) => {
	if (!request.body) {
		// no post body
		return apiHelper.sendApiGenericError(response);
	}

	const { username, password } = request.body;
	const newUser = new adminUser.adminUserModel({
		username,
		password
	});
	
	// saving to database
	newUser.save().then((user) => {
		return apiHelper.sendReturn(response, {
			username: user.username,
			role: user.role ? user.role : undefined
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		return apiHelper.sendApiError(response, 500, [rejection]);
	});
});

/* 
*	/admin/api/v1/removeadmin
*	- requires admin auth
*
*	registers a new admin user
*
*	post {
*		id - id of the admin user
*	}
*	return {
*		code: httpcode
*		success: boolean - true if delete was successull
*		errors: Strings[messages]
*	}
*/
router.post('/admin/api/v1/removeadmin', userMiddleware.adminAuthNeeded, (request, response) => {
	if (!request.body) {
		// no post body
		return apiHelper.sendApiGenericError(response);
	}

	const { id } = request.body;
	adminUser.adminUserModel.findByIdAndDelete(id, (error) => {
		if (error) {
			return apiHelper.sendApiError(response, 500, [error]);
		}
		// successfull
		return apiHelper.sendReturn(response, {});
	});
});

/* 
*	/admin/api/v1/listadmins
*	- requires admin auth
*
*	gets list of admins
*
*	return {
*		code: httpcode
*		success: boolean - true if delete was successull
*		errors: Strings[messages]
*	}
*/
router.get('/admin/api/v1/listadmins', userMiddleware.adminAuthNeeded, (request, response) => {
	adminUser.adminUserModel.find({}, (error, admins) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (error) {
			return apiHelper.sendApiError(response, 500, [error]);
		}

		// formats admin list and removes password hash
		const output = [];
		for (let i = 0, l = admins.length; i < l; i++) {
			admins[i].password = undefined;
			output.push(admins[i]);
		}

		return apiHelper.sendReturn(response, {
			admins: output
		});
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
router.get('/admin/api/v1/check', userMiddleware.authOptional, (request, response) => {
	const user = request.user;

	return apiHelper.sendReturn(response, {
		isAuthed: user ? true : false,
		role: user ? (user.role ? user.role : undefined) : undefined
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
router.get('/admin/api/v1/logout', userMiddleware.adminAuthNeeded, (request, response) => {
	request.logout();
	return apiHelper.sendReturn(response, {});
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
router.post('/admin/api/v1/newpost', userMiddleware.adminAuthNeeded, (request, response) => {
	
	if (!request.body) {
		return apiHelper.sendApiGenericError(response);
	}

	const { content, title, author, category, short } = request.body;
	const newBlogPost = new blogPost.blogPostModel({
		content: blogPost.blogPostModel.markdownToHtml(content),
		name: title,
		short,
		meta: {
			author,
			category,
			slug: title // convert title to slug
				.trim()
				.replace(/\s/g, '-')
				.replace(/[^A-z0-9-]/g, '')
				.toLowerCase()
		}
	});
	
	// saving post to database
	newBlogPost.save().then((post) => {
		return apiHelper.sendReturn(response, {
			url: moment(post.meta.date).format('YYYY-MM-DD') + '/' + post.meta.slug
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		return apiHelper.sendApiError(response, 500, [rejection]);
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
router.post('/admin/api/v1/editpost', userMiddleware.adminAuthNeeded, (request, response) => {
	
	if (!request.body) {
		return apiHelper.sendApiGenericError(response);
	}

	const { id, content, title, author, category, short } = request.body;
	blogPost.blogPostModel.findByIdAndUpdate(id, {
		'content': content,
		'name': title,
		'short': short,
		'meta.author': author,
		'meta.category': category
	}, (error, post) => {
		if (error) {
			return apiHelper.sendApiError(response, 500, [error]);
		}

		return apiHelper.sendReturn(response, {
			url: moment(post.meta.date, 'YYYY-MM-DD') + '/' + post.meta.slug
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
router.post('/admin/api/v1/newauthor', userMiddleware.adminAuthNeeded, (request, response) => {
	
	if (!request.body) {
		return apiHelper.sendApiGenericError(response);
	}

	const { name, description, image } = request.body;
	const newAuthor = new postAuthor.postAuthorModel({
		name,
		description,
		image
	});
	
	// saving author to database
	newAuthor.save().then((author) => {
		return apiHelper.sendReturn(response, {
			id: author.id
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		return apiHelper.sendApiError(response, 500, [rejection]);
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
router.post('/admin/api/v1/editauthor', userMiddleware.adminAuthNeeded, (request, response) => {
	
	if (!request.body) {
		return apiHelper.sendApiGenericError(response);
	}

	const { id, name, description, image } = request.body;

	// updating author in database
	postAuthor.postAuthorModel.findByIdAndUpdate(id, {
		name,
		description,
		image
	}, (error, author) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (error) {
			return apiHelper.sendApiError(response, 500, [error]);
		}

		return apiHelper.sendReturn(response, {
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
router.post('/admin/api/v1/newprogress', userMiddleware.adminAuthNeeded, (request, response) => {
	
	if (!request.body) {
		return apiHelper.sendApiGenericError(response);
	}

	// parses state and isGame to be valid
	const { title, description } = request.body;
	let { state } = request.body;
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
	
	// saving progress to database
	newProgress.save().then((progress) => {
		return apiHelper.sendReturn(response, {
			id: progress.id
		});
	}).catch((rejection) => {
		// TODO format exception so it doesnt have a huge list of errors
		return apiHelper.sendApiError(response, 500, [rejection]);
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
router.post('/admin/api/v1/editprogress', userMiddleware.adminAuthNeeded, (request, response) => {
	
	if (!request.body) {
		return apiHelper.sendApiGenericError(response);
	}

	// parsing state and isGame to be valid
	const { title, description, id } = request.body;
	let { state } = request.body;
	let isGame = false;
	if (state != '1' && state != '2' && state != '3') {
		state = undefined;
	} else {
		state = parseInt(state);
		isGame = true;
	}

	// updating progress in database
	progressList.progressListModel.findByIdAndUpdate(id, {
		title,
		description,
		state,
		isGame
	}, (error, progress) => {
		// TODO format exception so it doesnt have a huge list of errors
		if (error) {
			return apiHelper.sendApiError(response, 500, [error]);
		}

		return apiHelper.sendReturn(response, {
			id: progress.id
		});
	});
});

// api 404
router.use('/admin/api', (request, response) => {
	return apiHelper.sendApi404(response);
});

// export the router
module.exports = router;
