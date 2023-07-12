const editSettingsModal = document.querySelector('.modal-wrapper#edit-settings');
const editSettingsModalButtonClose = document.getElementById('editSettingsCloseButton');

editSettingsModalButtonClose?.addEventListener('click', () => {
	editSettingsModal.classList.add('hidden');
});

document.addEventListener('click', event => {
	if (event.target.classList.contains('edit')) {
		event.preventDefault();

		editSettingsModal.classList.remove('hidden');
	}
});
