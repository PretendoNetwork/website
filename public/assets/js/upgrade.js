const buttons = {
	submit: document.getElementById('submitButton'),
	unsubModal: {
		show: document.getElementById('unsubModalShowButton'),
		close: document.getElementById('unsubModalCloseButton'),
		confirm: document.getElementById('unsubModalConfirmButton'),
	},
	switchTierModal: {
		show: document.getElementById('switchTierShowButton'),
		close: document.getElementById('switchTierCloseButton'),
		confirm: document.getElementById('switchTierConfirmButton'),
	},
};

const currentTierID = document.querySelector('form').dataset.currentTier || undefined;

const currentTierElement = document.querySelector(`#${currentTierID}`) || undefined;

// if the condition is met, we disable the submit button and enable the unsubscribe button
function conditionalSubmitButton(condition, target) {
	if (condition) {
		buttons.submit.innerText = 'Already subscribed to this tier';
		buttons.unsubModal.show.innerText = `Unsubscribe from ${currentTierElement.dataset.tierName}`;
		buttons.submit.disabled = true;
		buttons.submit.classList.add('disabled');
		buttons.unsubModal.show.classList.remove('hidden');
	} else {
		buttons.submit.classList.remove('disabled');
		buttons.unsubModal.show.classList.add('hidden');
		buttons.submit.disabled = false;
		buttons.submit.innerText = `Subscribe to ${target.dataset.tierName}`;
	}
}

function submitForm(cancel) {
	const form = document.querySelector('form');

	if (cancel) {
		form.action = '/account/stripe/unsubscribe';
	} else {
		const selectedTier = form.querySelector('input[type="radio"]:checked').value;
		form.action = `/account/stripe/checkout/${selectedTier}`;
	}

	form.submit();
}

// If the currect tier exists, select it from the list and disable the submit button.
if (currentTierElement) {
	currentTierElement.click();
	conditionalSubmitButton(true);
}

// If a tier is selected, conditionally enable the submit button.
document.querySelector('form').addEventListener('change', function(e) {
	e.preventDefault();

	// If the selected tier is the current tier, set the button to disabled. Else we enable the button
	conditionalSubmitButton(e.target.value === currentTierElement?.value, e.target);
});

// handle the submit button
buttons.submit.addEventListener('click', function(e) {
	e.preventDefault();

	// If the user is already subscribed to another tier, we show the confirm modal, else if this is a new subscription we submit the form.
	if (currentTierElement) {
		const oldTierNameSpan = document.querySelector('#switchtier .modal-caption span.oldtier');
		const newTierNameSpan = document.querySelector('#switchtier .modal-caption span.newtier');
		oldTierNameSpan.innerText = currentTierElement.dataset.tierName;
		newTierNameSpan.innerText = document.querySelector('input[name="tier"]:checked').dataset.tierName;

		document.body.classList.add('modal-open');
		document.querySelector('.modal-wrapper#switchtier').classList.remove('hidden');
	} else {
		submitForm();
	}
});

buttons.unsubModal.show.addEventListener('click', function(e) {
	e.preventDefault();

	const tierNameSpan = document.querySelector('#unsub .modal-caption span');
	tierNameSpan.innerText = currentTierElement.dataset.tierName;

	// Show the unsubscribe modal
	document.body.classList.add('modal-open');
	document.querySelector('.modal-wrapper#unsub').classList.remove('hidden');
});
buttons.unsubModal.close.addEventListener('click', function(e) {
	e.preventDefault();

	// Hide the unsubscribe modal
	document.body.classList.remove('modal-open');
	document.querySelector('.modal-wrapper#unsub').classList.add('hidden');
});
buttons.unsubModal.confirm.addEventListener('click', function(e) {
	e.preventDefault();

	submitForm(true);
});

buttons.switchTierModal.close.addEventListener('click', function(e) {
	e.preventDefault();

	// Hide the switch tier modal
	document.body.classList.remove('modal-open');
	document.querySelector('.modal-wrapper#switchtier').classList.add('hidden');
});
buttons.switchTierModal.confirm.addEventListener('click', function(e) {
	e.preventDefault();

	submitForm(false);
});
