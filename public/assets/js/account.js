
document.getElementById('remove-discord-connection')?.addEventListener('click', () => {
	// TODO: Refresh access token if expired (move this to the backend maybe?)

	const tokenType = document.cookie.split('; ').find(row => row.startsWith('token_type=')).split('=')[1];
	const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token=')).split('=')[1];

	fetch('https://api.pretendo.cc/v1/connections/remove/discord', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `${tokenType} ${decodeURIComponent(accessToken)}`
		}
	})
		.then(response => response.json())
		.then(({ status }) => {
			if (status === 200) {
				location.reload();
			}
		})
		.catch(console.log);
});