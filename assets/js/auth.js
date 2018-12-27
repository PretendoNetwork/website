function postAjax(url, data, success) {
	var params = (typeof data == 'string') ? data : Object.keys(data).map(function (k) {
		return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) 
	}).join('&');

	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhr.open('POST', url);
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(params);
	return xhr;
}

function showErrorPopup(errorText) {
	console.log(errorText)
}

function login() {
	var xhr = postAjax('/api/v1/login', {
		email: document.getElementById('email_input').value,
		password: document.getElementById('password_input').value
	});
	xhr.onload = function () {
		if (xhr.responseText.charAt(0) !== "{") {
			return showErrorPopup('Whoops, something went wrong. Try again later.');
		}
		response = JSON.parse(xhr.responseText);
		if (response.success === true) {
			location.pathname = '/pnid/dashboard';
		} else if (response.errors) {
			showErrorPopup(response.errors);
		}
	}
}

function register() {
	var xhr = postAjax('/api/v1/register', {
		email: document.getElementById('email_input').value,
		username: document.getElementById('username_input').value,
		password: document.getElementById('password_input').value,
		confirm_password: document.getElementById('password_confirm_input').value
	});
	xhr.onload = function () {
		if (xhr.responseText.charAt(0) !== "{") {
			return showErrorPopup('Whoops, something went wrong. Try again later.');
		}
		response = JSON.parse(xhr.responseText);
		if (response.success === true) {
			login();
		} else if (response.errors) {
			showErrorPopup(response.errors);
		}
	}
}