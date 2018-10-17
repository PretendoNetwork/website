/*

util.js -
small commonly used utilities

*/

// shows 404 template. takes express response object
function send404(res) {
	res.status(404).send('404');
}

module.exports = {
	send404
};