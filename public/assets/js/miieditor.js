// This file gets automatically bundled with browserify when running the start script. This also means that after any update you're gonna need to restart the server.

// Prevent the user from reloading or leaving the page
window.addEventListener('beforeunload', function (e) {
	e?.preventDefault();
	e.returnValue = '';
});

const Mii = require('./MiiClass.js');

// MII RENDERER

// The Mii data is stored in a script tag in the HTML, so we can just grab it and then remove the element
const encodedUserMiiData = document.querySelector(
	'script#encodedUserMiiData'
).textContent;
document.querySelector('script#encodedUserMiiData').remove();
// We initialize the Mii object with the encoded data and render the Mii
const mii = new Mii(Buffer.from(encodedUserMiiData, 'base64'));
renderMii();

const oldMiiStudioData = mii.toStudioMii().toString('hex');

// initial setup for saving animation
document.querySelector('.mii-comparison img.old-mii').src = `https://studio.mii.nintendo.com/miis/image.png?data=${oldMiiStudioData}&type=face&expression=normal&width=512&bgColor=13173300`;
document.querySelector('.mii-comparison.confirmed img.old-mii').src = `https://studio.mii.nintendo.com/miis/image.png?data=${oldMiiStudioData}&type=face&expression=sorrow&width=512&bgColor=13173300`;

// This function renders the Mii on the page
function renderMii(type) {
	type = type || 'all_body'; // Can be 'all_body' or 'face'

	const miiStudioData = mii.toStudioMii().toString('hex');
	document.querySelector(
		'img#mii-img'
	).src = `https://studio.mii.nintendo.com/miis/image.png?data=${miiStudioData}&type=${type}&expression=normal&width=512&bgColor=13173300`;

	// sets the new mii in the save tab to the new mii
	document.querySelector(
		'.mii-comparison img.new-mii'
	).src = `https://studio.mii.nintendo.com/miis/image.png?data=${miiStudioData}&type=face&expression=normal&width=512&bgColor=13173300`;
	document.querySelector(
		'.mii-comparison.confirmed img.new-mii'
	).src = `https://studio.mii.nintendo.com/miis/image.png?data=${miiStudioData}&type=face&expression=smile&width=512&bgColor=13173300`;

	// this sets the mii height so that the face width stays the same
	document.querySelector('img#mii-img').style.height = `${
		mii.height * mii.height * 0.0023 + mii.height * 1.058 + 384
	}px`;

	// this sets the bottom position so that the mii's feet stay in the same position
	document.querySelector('img#mii-img').style.bottom = `${
		mii.height * mii.height * -0.00468135 + mii.height * 0.28 - 0.052435
	}px`;

	console.log(mii);
}

// This function updates a prop of the Mii and rerenders it
function updateMii(e, type) {
	const prop = e.target.name;
	const value = e.target.value;
	mii[prop] = parseInt(value);
	renderMii(type);
}

document.querySelectorAll('fieldset').forEach((fieldset) => {
	fieldset.addEventListener('change', (e) => updateMii(e));
});

document.querySelectorAll('input[type=\'range\']').forEach((fieldset) => {
	fieldset.addEventListener('input', (e) => updateMii(e));
});

// FORM

// Here we preselect the options corresponding to the Mii's current values
[
	'faceType',
	'faceColor',
	'faceMakeup',
	'faceWrinkles',
	'hairType',
	'hairColor',
	'eyebrowType',
	'eyebrowColor',
	'eyeType',
	'eyeColor',
	'noseType',
	'mouthType',
	'mouthColor',
	'glassesType',
	'glassesColor',
	'facialHairType',
	'facialHairColor',
	'facialHairMustache',
	'moleEnable',
	'gender',
	'favoriteColor'
].forEach((prop) => {
	document.querySelector(`#${prop}${mii[prop]}`).checked = true;
});

[
	'eyebrowVertical',
	'eyebrowHorizontal',
	'eyebrowRotation',
	'eyebrowSize',
	'eyebrowStretch',
	'eyeVertical',
	'eyeHorizontal',
	'eyeRotation',
	'eyeSize',
	'eyeStretch',
	'noseVertical',
	'noseSize',
	'mouthVertical',
	'mouthSize',
	'mouthStretch',
	'glassesVertical',
	'glassesSize',
	'facialHairVertical',
	'facialHairSize',
	'moleVertical',
	'moleHorizontal',
	'moleSize',
	'height',
	'build'
].forEach((prop) => {
	document.querySelector(`#${prop}`).value = mii[prop];
});


// TABS, SUBTABS, AND ALL THE INHERENT JANK

function openTab(e, tabType) {
	e.preventDefault();

	// Deselect all subpages
	document.querySelectorAll('.subtab.has-subpages .subpage.active').forEach((el) => {
		el.classList?.remove('active');
	});
	document.querySelectorAll('.subtab.active').forEach((el) => {
		el.classList?.remove('active');
	});

	const buttonReplacement = tabType.charAt(0).toUpperCase() + tabType.slice(1);

	document.querySelectorAll(`.${tabType}.active`).forEach(el => {
		el?.classList?.remove('active');
	});
	document.querySelectorAll(`.${tabType}btn.active`).forEach(el => {
		el?.classList?.remove('active');
	});

	const elementID = e.target?.id;
	document.querySelector(`#${elementID}`).classList.add('active');
	const selectedID = elementID
		.replace('SubButton', '')
		.replace('Button', buttonReplacement);
	document.querySelector(`#${selectedID}`).classList.add('active');

	if (tabType === 'tab') {
		// Click the first subtab button, if there is one
		document.querySelector(`#${selectedID} .subtabbtn`)?.click();
	}

	// We hide all subpages
	document.querySelectorAll('.subpage').forEach((el) => {
		el.classList.remove('active');
	});

	// Selects the first subpage if there is one
	document
		.querySelector(`#${selectedID} .subpage`)
		?.classList?.add('active');
}

// Here we bind all of the functions to the corresponding buttons
document.querySelectorAll('.tabs button.tabbtn').forEach((el) => {
	el.addEventListener('click', (e) => openTab(e, 'tab'));
});
document.querySelectorAll('.subtabs button.subtabbtn').forEach((el) => {
	el.addEventListener('click', (e) => openTab(e, 'subtab'));
});

// SUBPAGES

function paginationHandler(e) {
	e.preventDefault();

	// We hide all subpages
	document.querySelectorAll('.subpage').forEach((el) => {
		el.classList.remove('active');
	});

	// We get the current subpage
	const currentPageIndex = parseInt(
		e.target.classList[2].replace('index-', '')
	);
	let newPageIndex = currentPageIndex;

	// We calculate the new subpage
	if (e.target.classList.contains('next')) {
		newPageIndex += 1;
	} else {
		newPageIndex -= 1;
	}

	// We find the new subpage and activate it
	e.target.parentNode.parentNode.parentNode.children[
		newPageIndex
	].classList.add('active');
}

// This adds 1 to the rendered page indexes to make them start from 1 instead of 0
document.querySelectorAll('span.current-page-index').forEach((el) => {
	el.textContent = parseInt(el.textContent) + 1;
});

// Here we bind the functions to the corresponding buttons
document.querySelectorAll('button.page-btn').forEach((el) => {
	el.addEventListener('click', paginationHandler);
});

// mii saving business (animation jank & actual saving)
document.querySelector('#saveTab #saveButton').addEventListener('click', (e) => {
	e.preventDefault();

	document.querySelector('#saveTab #saveButton').classList.add('inactive', 'fade-out');
	document.querySelector('.tabs').style.pointerEvents = 'none';
	document.querySelector('.mii-comparison.confirmed').style.opacity = 1;
	document.querySelector('#saveTab p.save-prompt').classList.add('fade-out');

	setTimeout(() => {
		document.querySelector('.mii-comparison.unconfirmed').style.opacity = 0;
	}, 500);

	setTimeout(() => {
		document.querySelector('.mii-comparison.confirmed .old-mii').classList.add('fade-out');
		document.querySelector('.mii-comparison.confirmed svg').classList.add('fade-out');
	}, 1500);

	setTimeout(() => {
		document.querySelector('.mii-comparison.confirmed .new-mii').classList.add('centered-mii-img');
	}, 2000);


});
