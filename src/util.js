function fullUrl(request) {
	return `${request.protocol}://${request.hostname}${request.originalUrl}`;
}

module.exports = {
	fullUrl
}