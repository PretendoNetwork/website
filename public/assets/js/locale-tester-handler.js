/* eslint-disable no-undef */
const form = document.querySelector('.localization-form');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	e.stopPropagation();
	window.location.href=`https://pretendo-locale-tester.herokuapp.com/?url=${e.target[0].value}`;
});
