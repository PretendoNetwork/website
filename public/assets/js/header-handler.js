/* eslint-disable no-undef, no-unused-vars */

const header = document.querySelector('header');
const dropdownButtonWrapper = document.querySelector('.dropdown-button-wrapper');
const dropdown = document.querySelector('header div.dropdown');
const allDropdownButtons = document.querySelectorAll('button.dropdown-button');
const desktopDropdownBtns = document.querySelectorAll('header .dropdown-button-wrapper button.dropdown-button');
const mobileDropdownBtn = document.querySelector('.dropdown-button#mobile-button');
let dropdownContent;

function isDropdownOpen() {
	return header.classList.contains('dropdown-active');
}

function closeDropdown() {
	dropdown.style.height = '0';
	header.classList.remove('dropdown-active');
	// deselect all buttons
	allDropdownButtons.forEach((button) => {
		button.classList.remove('active');
	});
}
window.addEventListener('resize', () => {
	if (isDropdownOpen() && dropdownContent) {
		// set the dropdown height to the height of the content
		dropdown.style.height = `${dropdownContent.offsetHeight}px`;
	}
});

function navbarDropdownHandler(buttonID) {
	const allDropdownContents = dropdown.querySelectorAll('div.dropdown-content');
	dropdownContent = document.querySelector(`.dropdown-content#${buttonID}-dropdown-content`);
	const dropdownButton = document.querySelector(`button.dropdown-button#${buttonID}-button`);
	const dropdownArrow = document.querySelector('.dropdown-arrow#navbar-dropdown-arrow');

	// if on mobile, reclicking the button should close the dropdown
	if (buttonID === 'mobile' && dropdownButton.classList.contains('active')) {
		closeDropdown();
		return;
	}

	// hide all contents
	allDropdownContents.forEach((content) => {
		content.classList.remove('show');
	});
	// deselect all buttons
	allDropdownButtons.forEach((button) => {
		button.classList.remove('active');
	});
	// show the content of the clicked button
	dropdownContent.classList.add('show');
	// select the clicked button
	dropdownButton.classList.add('active');
	// set the dropdown height to the height of the content
	dropdown.style.height = `${dropdownContent.offsetHeight}px`;

	// move the arrow to the selected button
	dropdownArrow.style.left = `${dropdownButton.offsetLeft + dropdownButton.offsetWidth / 2 - 5}px`;

	// dim the rest of the page
	header.classList.add('dropdown-active');
}

const dropdownAnchors = document.querySelectorAll('.dropdown-content a');
dropdownAnchors.forEach((a) => {
	a.addEventListener('click', () => {
		closeDropdown();
	});
});


// make the header background transparent if near the top of the page
function makeHeaderBackgroundTransparent() {
	if(window.pageYOffset < 100) {
		header.classList.add('transparent');
	} else {
		header.classList.remove('transparent');
	}
}
makeHeaderBackgroundTransparent();
window.addEventListener('scroll', () => {
	makeHeaderBackgroundTransparent();
});

desktopDropdownBtns.forEach((btn) => {
	[ 'click', 'mouseover' ].forEach((event) => {
		btn.addEventListener(event, () => {
			const id = btn.id.replace('-button', '');
			navbarDropdownHandler(id);
		});
	});
});
mobileDropdownBtn.addEventListener('click', () => {
	const id = 'mobile';
	navbarDropdownHandler(id, true);
});

/* if on desktop: we check if the element the mouse moves to is part of the ignored element (keep the dropdown open) or not (close the dropdown)
 * if on mobile: do nothing
*/
function dropdownOnMouseLeave(e, ignoredElement) {
	if (window.innerWidth > 900) {
		const targetElement = e.relatedTarget || e.toElement;
		if (targetElement !== ignoredElement && !ignoredElement.contains(targetElement)) {
			closeDropdown();
		}
	}
}
dropdownButtonWrapper.addEventListener('mouseleave', (e) => {
	dropdownOnMouseLeave(e, dropdown);
});
dropdown.addEventListener('mouseleave', (e) => {
	dropdownOnMouseLeave(e, dropdownButtonWrapper);
});

// Account widget handler
const userWidgetToggle = document.querySelector('.user-widget-toggle') ;
const userWidget = document.querySelector('.user-widget');

// Open widget on click, close locale dropdown
userWidgetToggle?.addEventListener('click', () => {
	userWidget.classList.toggle('active');
	localeOptionsContainer.classList.toggle('active');
	localeDropdownToggle.classList.toggle('active');
});

// Locale dropdown handler
function localeDropdownHandler(selectedLocale) {
	document.cookie = `preferredLocale=${selectedLocale};max-age=31536000`;
	window.location.reload();
}

const localeDropdown = document.querySelector(
	'.locale-dropdown[data-dropdown]'
);
const localeDropdownOptions = document.querySelectorAll(
	'.locale-dropdown[data-dropdown] .options-container'
);
const localeDropdownToggle = document.querySelector('.locale-dropdown-toggle');

const localeOptionsContainer = localeDropdown.querySelector('.options-container');
const localeOptionsList = localeDropdown.querySelectorAll('.option');

// click dropdown element will open dropdown
localeDropdownToggle.addEventListener('click', () => {
	localeOptionsContainer.classList.toggle('active');
	localeDropdownToggle.classList.toggle('active');
});

// clicking on any option will close dropdown and change value
localeOptionsList.forEach((option) => {
	option.addEventListener('click', () => {
		localeDropdownToggle.classList.remove('active');
		localeOptionsContainer.classList.remove('active');
		const selectedLocale = option.querySelector('label').getAttribute('for');
		localeDropdownHandler(selectedLocale);
	});
});

// close all dropdowns on scroll
document.addEventListener('scroll', () => {
	localeDropdownOptions.forEach((el) => el.classList.remove('active'));
	localeDropdownToggle.classList.remove('active');

	userWidget?.classList.remove('active');
});

// click outside of dropdown will close all dropdowns
document.addEventListener('click', (e) => {
	const targetElement = e.target;

	let found = false;
	if (
		localeDropdown == targetElement ||
		localeDropdown?.contains(targetElement)
	) {
		found = true;
		userWidget?.classList.remove('active');
	}

	if (
		userWidget == targetElement ||
	userWidget?.contains(targetElement) ||
	userWidgetToggle == targetElement ||
	userWidgetToggle?.contains(targetElement)
	) {
		found = true;
		localeDropdownToggle.classList.remove('active');
		localeOptionsContainer.classList.remove('active');
	}

	if (found) return;

	// click outside of dropdowns
	userWidget?.classList.remove('active');
	localeDropdownToggle.classList.remove('active');
	localeOptionsContainer.classList.remove('active');
});
