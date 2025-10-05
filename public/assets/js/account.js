const updateServerEnvironmentForm = document.querySelector('form.server-selection');
const serverSelectionSaveButton = document.querySelector('#save-server-selection');
const editSettingsModal = document.querySelector('.modal-wrapper#edit-settings');
const editSettingsModalButtonClose = document.getElementById('editSettingsCloseButton');
const deleteAccountButton = document.getElementById('account-delete');
const deletePNIDConfirmModal = document.querySelector('.modal-wrapper#confirm-delete');
const deletePNIDConfirmModalButtonConfirm = document.getElementById('confirmDeleteConfirmButton');
const deletePNIDConfirmModalButtonClose = document.getElementById('confirmDeleteCloseButton');

editSettingsModalButtonClose?.addEventListener('click', () => {
	editSettingsModal.classList.add('hidden');
});

document.addEventListener('click', (event) => {
	if (event.target.classList.contains('edit')) {
		event.preventDefault();

		editSettingsModal.classList.remove('hidden');
	}
});

serverSelectionSaveButton?.addEventListener('click', (event) => {
	event.preventDefault();
	const checkedInput = updateServerEnvironmentForm.querySelector('input:checked');

	try {
		const tokenType = document.cookie.split('; ').find(row => row.startsWith('token_type=')).split('=')[1];
		const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token=')).split('=')[1];

		fetch('https://api.pretendo.cc/v1/user', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `${tokenType} ${decodeURIComponent(accessToken)}`
			},
			body: JSON.stringify({
				environment: checkedInput.value
			})
		})
			.then(response => response.json())
			.then((json) => {
				if (!json.error) {
					// TODO - Make this prettier
					alert('Saved server environment');
				} else {
					console.log(json.error);
					alert('Failed to server environment');
				}
			})
			.catch((error) => {
				console.log(error);
				// TODO - Make this prettier
				alert('Failed to server environment');
			});
	} catch (error) {
		alert(error);
	}
});

deleteAccountButton?.addEventListener('click', (event) => {
	event.preventDefault();
	deletePNIDConfirmModal.classList.remove('hidden');
});

deletePNIDConfirmModalButtonConfirm?.addEventListener('click', async () => {
	await fetch('/account/delete', {
		method: 'POST'
	});

	deletePNIDConfirmModal.classList.add('hidden');
});

deletePNIDConfirmModalButtonClose?.addEventListener('click', () => {
	deletePNIDConfirmModal.classList.add('hidden');
});
