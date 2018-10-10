/*

common.js -
common page functionality.

*/

function sendDefault404(req, res) {
    res.status(404).send('404');
}

function sendApi404(req, res) {
    res.status(404).json({
        error: {
            code: 404,
            message: "Endpoint not in use"
        }
    });
}

function sendApiAuthError(req, res) {
    res.status(401).json({
        error: {
            code: 401,
            message: "Not authenticated"
        }
    });
}

function sendApiGenericError(req, res) {
    res.status(400).json({
        error: {
            code: 400,
            message: "Bad request"
        }
    });
}

function sendApiError(res, code, message) {
    res.status(code).json({
        error: {
            code,
            message
        }
    });
}

module.exports = {
    sendDefault404,
    sendApi404,
    sendApiGenericError,
    sendApiError,
    sendApiAuthError
};