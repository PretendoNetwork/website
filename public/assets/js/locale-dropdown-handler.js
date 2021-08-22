function setFormDefaultLocale(localeString) {
	try {
		document.querySelector(`option[value=${localeString}`).selected = true;
	} catch {} // If the locale isn't listed
}

function localeFormHandler() {
	const selectedLocale = document.querySelector("#locale-dropdown").value;
	document.cookie = `preferredLocale=${selectedLocale};max-age=31536000`;
	window.location.reload();
}
