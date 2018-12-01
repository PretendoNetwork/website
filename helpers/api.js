/*

api.js -
common api returns

*/

/**
 * Send generic API response
 * @param {ServerResponse} response An express ServerResponse response
 * @param {Object} data Response data
 * @param {Array} errors Request errors
 */
function sendReturn(response, data, errors) {
	return response.status(data.code || 200).json(
		Object.assign({
			code: 200,
			success: true,
			errors: [] +  (errors ? errors : [])
		}, data)
	);
}

/**
 * Send API 404
 * @param {ServerResponse} response An express ServerResponse response
 */
function sendApi404(response) {
	return sendApiError(response, 404, [
		'Endpoint not in use'
	]);
}

/**
 * Send user not authenticated error
 * @param {ServerResponse} response An express ServerResponse response
 */
function sendApiAuthError(response) {
	return sendApiError(response, 401, [
		'Not authenticated'
	]);
}

/**
 * Send a generic API error
 * @param {ServerResponse} response An express ServerResponse response
 */
function sendApiGenericError(response) {
	return sendApiError(response, 400, [
		'Bad request'
	]);
}

/**
 * Send an API error
 * @param {ServerResponse} response An express ServerResponse response
 */
function sendApiError(response, code, errors) {
	return sendReturn(response, {
		code,
		success: false
	}, errors);
}

module.exports = {
	sendReturn,
	sendApi404,
	sendApiGenericError,
	sendApiError,
	sendApiAuthError
};