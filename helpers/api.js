/*

api.js -
common api returns

*/

// use for any api return. it has basic layout used for every return.
function sendReturn(res, data, errors) {
	res.status(200).json(
		// combine 2 objects
		Object.assign({
			code: 200,
			success: true,
			errors: [] +  (errors ? errors : [])
		}, data)
	);
}


// use if api endpoint doesnt exist
function sendApi404(res) {
	res.status(404).json({
		code: 404,
		errors: [
			'Endpoint not in use'
		]
	});
}

// use if not logged in and is required (handled with middleware)
function sendApiAuthError(res) {
	res.status(401).json({
		code: 401,
		errors: [
			'Not authenticated'
		]
	});
}

// use for completely broken requests
function sendApiGenericError(res) {
	res.status(400).json({
		code: 400,
		success: false,
		errors: [
			'Bad request'
		]
	});
}

// use for any api not successfull
function sendApiError(res, code, errors) {
	res.status(code).json({
		code,
		success: false,
		errors
	});
}

module.exports = {
	sendReturn,
	sendApi404,
	sendApiGenericError,
	sendApiError,
	sendApiAuthError
};