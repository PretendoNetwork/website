/* eslint-disable no-undef, no-unused-vars */
function setDefaultDropdownLocale(localeString) {
	try {
		const selected = document.querySelector('.selected-locale');
		let item = document.querySelector(`label[for=${localeString}]`) || document.querySelector(`label[for=en-US]`);
		selected.innerHTML = item.innerHTML;
	} catch (e) {} // If it errors it's probably because there isn't a navbar in the view
}

function localeDropdownHandler(selectedLocale) {
	document.cookie = `preferredLocale=${selectedLocale};max-age=31536000`;
	window.location.reload();
}

const dropdowns = document.querySelectorAll('*[data-dropdown]');
const dropdownOptions = document.querySelectorAll(
	'*[data-dropdown] .options-container'
);

dropdowns.forEach((el) => {
	const selected = el.querySelector('.selected-locale');
	const optionsContainer = el.querySelector('.options-container');
	const optionsList = el.querySelectorAll('.option');

	// click dropdown element will open dropdown
	selected.addEventListener('click', () => {
		optionsContainer.classList.toggle('active');
	});

	// clicking on any option will close dropdown and change value
	optionsList.forEach((option) => {
		option.addEventListener('click', () => {
			selected.innerHTML = option.querySelector('label').innerHTML;
			optionsContainer.classList.remove('active');
			const selectedLocale = option.querySelector('label').getAttribute('for');
			localeDropdownHandler(selectedLocale);
		});
	});
});

// close all dropdowns on scroll
document.addEventListener('scroll', () => {
	dropdownOptions.forEach((el) => el.classList.remove('active'));
});

// click outside of dropdown will close all dropdowns
document.addEventListener('click', (e) => {
	const targetElement = e.target;

	// check if target is from a dropdown
	let found = false;
	dropdowns.forEach((v) => {
		if (v == targetElement || v.contains(targetElement)) found = true;
	});

	if (found) return;

	// click outside of dropdowns
	dropdownOptions.forEach((el) => el.classList.remove('active'));
});
