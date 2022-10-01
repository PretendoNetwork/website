const config = require('../../../config.json');

const input = document.querySelector('#input');
document.querySelector('form').addEventListener('submit', function (event) {
	event.preventDefault();

	fetch(`${config.api_base}/v1/forgot-password`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			input: input.value
		})
	})
		.then(response => response.json())
		.then(body => {
			if (body.error) {
				alert(`Error: ${body.error}. TODO: red error message thing`);
			} else {
				alert('If an account exists with the provided username/email address an email has been sent. TODO: reword this and green success');
			}
		})
		.catch(console.log);
});