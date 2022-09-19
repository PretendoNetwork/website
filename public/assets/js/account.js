const onlineFilesModal = document.querySelector('.modal-wrapper#onlinefiles');
const onlineFilesModalButtonConfirm = document.getElementById('onlineFilesConfirmButton');
const onlineFilesModalButtonClose = document.getElementById('onlineFilesCloseButton');
const onlineFilesModalPasswordInput = document.getElementById('password');

const editSettingsModal = document.querySelector('.modal-wrapper#edit-settings');
const editSettingsModalButtonClose = document.getElementById('editSettingsCloseButton');

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

editSettingsModalButtonClose?.addEventListener('click', () => {
	editSettingsModal.classList.add('hidden');
});

document.addEventListener('click', event => {
	if (event.target.classList.contains('edit')) {
		event.preventDefault();
		
		editSettingsModal.classList.remove('hidden');
	}
});
