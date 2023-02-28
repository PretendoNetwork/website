const config = require('../../../config.json');

const passwordInput = document.querySelector('#password');
const passwordConfirmInput = document.querySelector('#password_confirm');
const tokenInput = document.querySelector('#token');

document.querySelector('form').addEventListener('submit', function (event) {
	event.preventDefault();

	fetch(`${config.api_base}/v1/reset-password`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			password: passwordInput.value,
			password_confirm: passwordConfirmInput.value,
			token: tokenInput.value
		})
	})
		.then(response => response.json())
		.then(body => {
			if (body.error) {
				alert(`Error: ${body.error}. TODO: red error message thing`);
			} else {
				alert('Password reset. TODO: reword this and green success');
				window.location.assign('/account/login');
			}
		})
		.catch(console.log);
});