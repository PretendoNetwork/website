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

function login() {
	var xhr = postAjax('/api/v1/login', {
		email: document.getElementById('email_input').value,
		password: document.getElementById('password_input').value
	});
	xhr.onload = function () {
		console.log(xhr.responseText);
		response = JSON.parse(xhr.responseText);
		if (response.success === true) {
			location.pathname = '/pnid/dashboard';
		}
	}
}