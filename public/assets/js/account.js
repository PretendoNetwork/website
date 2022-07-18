
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

const onlineFilesModal = document.querySelector('.online-files-modal-wrapper');
const onlineFilesModalButtonConfirm = document.getElementById('onlineFilesConfirmButton');
const onlineFilesModalButtonClose = document.getElementById('onlineFilesCloseButton');
const onlineFilesModalPasswordInput = document.getElementById('password');

document.getElementById('download-cemu-files')?.addEventListener('click', event => {
	event.preventDefault();

	onlineFilesModal.classList.remove('hidden');
});

onlineFilesModalButtonConfirm?.addEventListener('click', () => {
	fetch('/account/online-files', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 
			password: onlineFilesModalPasswordInput.value
		})
	})
		.then(response => response.blob())
		.then()
		.then(blob => URL.createObjectURL(blob))
		.then(blobUrl => {
			const a = document.createElement('a');
			a.href = blobUrl;
			a.setAttribute('download', 'Cemu Pretendo Online Files.zip');
			a.click();

			onlineFilesModal.classList.add('hidden');
		})
		.catch(console.log);
});

onlineFilesModalButtonClose?.addEventListener('click', () => {
	onlineFilesModal.classList.add('hidden');
});