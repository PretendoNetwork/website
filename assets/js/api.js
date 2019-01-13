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
	console.log(errorText);
	document.getElementById('errorBox').innerHTML = errorText;
	document.getElementById('errorBox').classList.remove('hide');
}

function showSuccessPopup(successText) {
	document.getElementById('successBox').innerHTML = successText;
	document.getElementById('successBox').classList.remove('hide');
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

function editInfo() {
	var xhr = postAjax('/api/v1/editaccount', {
		email: document.getElementById('email_input').value,
		username: document.getElementById('username_input').value
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

function passwordForgot() {
	var xhr = postAjax('/api/v1/passwordforgot', {
		email: document.getElementById('email_input').value
	});
	xhr.onload = function () {
		if (xhr.responseText.charAt(0) !== "{") {
			return showErrorPopup('Whoops, something went wrong. Try again later.');
		}
		response = JSON.parse(xhr.responseText);
		if (response.success === true) {
			document.getElementById('email_input').value = '';
			return showSuccessPopup('An email has been sent to your email address.');
		} else if (response.errors) {
			showErrorPopup(response.errors);
		}
	}
}

function passwordReset() {
	var xhr = postAjax('/api/v1/passwordreset', {
		password: document.getElementById('password_input').value,
		password_confirm: document.getElementById('password_confirm').value
	});
	xhr.onload = function () {
		if (xhr.responseText.charAt(0) !== "{") {
			return showErrorPopup('Whoops, something went wrong. Try again later.');
		}
		response = JSON.parse(xhr.responseText);
		if (response.success === true) {
			location.pathname = '/pnid/login';
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

function sendMessage() {
	var xhr = postAjax('/api/v1/sendmessage', {
		email: document.getElementById('email_input').value,
		subject: document.getElementById('subject_input').value,
		message: document.getElementById('message_input').value
	});
	xhr.onload = function () {
		if (xhr.responseText.charAt(0) !== "{") {
			return showErrorPopup('Whoops, something went wrong. Try again later.');
		}
		response = JSON.parse(xhr.responseText);
		if (response.success === true) {
			document.getElementById('email_input').value = '';
			document.getElementById('subject_input').value = '';
			document.getElementById('message_input').value = '';
			return showSuccessPopup('Your message has been sent.');
		} else if (response.errors) {
			showErrorPopup(response.errors);
		}
	}
}

function email_resend() {
	var xhr = postAjax('/api/v1/resendemail', {});
	document.getElementById('email_verification_popup').classList.add('closed');
}