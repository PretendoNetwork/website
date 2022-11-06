/**
 * Compilation note:
 * This file gets automatically bundled with browserify when running the start script.
 * This also means that after any update you're gonna need to restart the server to see any changes.
 *
 * browserify is needed for the use of require() in the browser
 */
const Mii = require('mii-js');
const config = require('../../../config.json');
const newMiiData = 'AwAAQOlVognnx0GC2qjhdwOzuI0n2QAAAGBzAHQAZQB2AGUAAAAAAAAAAAAAAEBAAAAhAQJoRBgmNEYUgRIXaA0AACkAUkhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAANeC';

// Prevent the user from reloading or leaving the page
window.onbeforeunload = function (e) {
	e?.preventDefault();
	e.returnValue = '';
};

// this makes it so the canvas fits in the target element
function setCanvasScale() {
	let targetX;
	let targetY;

	if (window.innerWidth <= 1080) {
		const canvasWrapper = document.querySelector('.canvas-wrapper');

		targetX = canvasWrapper.offsetWidth;
		targetY = canvasWrapper.offsetHeight;
	} else {
		targetX = window.innerWidth * 0.9;
		targetY = window.innerHeight * 0.9;
	}

	const canvas = document.querySelector('canvas#miiCanvas');
	const XScale = targetX / canvas.width;
	const YScale = targetY / canvas.height;
	canvas.style.transform = `scale(${Math.min(XScale, YScale)})`;
}

setCanvasScale();
window.addEventListener('resize', () => {
	setCanvasScale();
});

let mii; // global mii object

// this initalizes a mii for editing
// returns if mii data was parsed successfully
function initializeMiiData(encodedUserMiiData) {
	console.group('Initalizing Mii data');
	console.log('encoded mii data:', encodedUserMiiData);

	// We initialize the Mii object
	try {
		console.log('Attempting to parse mii data');
		mii = new Mii(Buffer.from(encodedUserMiiData, 'base64'));
	} catch (err) {
		console.error('failed to decode mii data', err);
		console.groupEnd();
		return false;
	}

	// We set the img sources for the unedited miis in the save animation
	console.log('grabbing rendered miis for later use');
	const miiStudioNeutralUrl = mii.studioUrl({
		width: 512,
		bgColor: '13173300',
	});
	const miiStudioSorrowUrl = mii.studioUrl({
		width: 512,
		bgColor: '13173300',
		expression: 'sorrow',
	});
	document.querySelector('.mii-comparison img.old-mii').src = miiStudioNeutralUrl;
	document.querySelector('.mii-comparison.confirmed img.old-mii').src = miiStudioSorrowUrl;
	console.log('initialization complete');
	console.groupEnd();
	return true;
}

// The Mii data is stored in a script tag in the HTML, so we can just grab it and then remove the element
const encodedUserMiiData = document.querySelector(
	'script#encodedUserMiiData'
).textContent;
document.querySelector('script#encodedUserMiiData').remove();

// is valid mii data
const validMiiData = initializeMiiData(encodedUserMiiData);
if (!validMiiData) {
	const shouldContinue = window.confirm('Found corrupted mii data, want to continue with a new Mii?');
	if (!shouldContinue)
		window.location.assign('/account');
	initializeMiiData(newMiiData);
}

// we keeep the images here so we can cache them when we need to change the build/height
const miiFaceImg = new Image();
const baldMiiFaceImg = new Image();
const miiBodyImg = new Image();

// Initial mii render
renderMii();
// This function renders the Mii on the canvas
function renderMii(heightOverride, buildOverride) {
	const canvas = document.querySelector('canvas#miiCanvas');
	const ctx = canvas.getContext('2d');
	const height = heightOverride || mii.height;
	const build = buildOverride || mii.build;

	// if there isn't an override or the images haven't been cached, we load the images
	if ((!heightOverride && !buildOverride) || !miiFaceImg.src || !baldMiiFaceImg.src || !miiBodyImg.src) {
		canvas.style.filter = 'blur(4px) brightness(70%)';

		// we create a copy of the mii and make it bald
		const baldMii = Object.create(
			Object.getPrototypeOf(mii),
			Object.getOwnPropertyDescriptors(mii)
		);
		baldMii.hairType = 30;
		baldMiiFaceImg.src = baldMii.studioUrl({
			width: 512,
			bgColor: '13173300',
			type: 'face_only',
		});
		miiFaceImg.src = mii.studioUrl({
			width: 512,
			bgColor: '13173300',
			type: 'face_only',
		});
		miiBodyImg.src = mii.studioAssetUrlBody();
	}

	// misc calculations
	const bodyWidth = (build * 1.7 + 220) * (0.003 * height + 0.6);
	const bodyHeight = height * 3.5 + 227;
	const bodyXPos = (canvas.width - bodyWidth) / 2;
	const bodyYPos = canvas.height - bodyHeight;
	const headYPos = bodyYPos - 408;

	// we make sure every image is loaded before rendering
	if (miiFaceImg.complete) {
		onMiiFaceImgLoad();
	} else {
		miiFaceImg.onload = () => {
			onMiiFaceImgLoad();
		};
	}
	function onMiiFaceImgLoad() {
		if (miiBodyImg.complete) {
			onBodyImgLoad();
		} else {
			miiBodyImg.onload = () => {
				onBodyImgLoad();
			};
		}
	}
	function onBodyImgLoad() {
		if (baldMiiFaceImg.complete) {
			onBaldMiiFaceImgLoad();
		} else {
			baldMiiFaceImg.onload = () => {
				onBaldMiiFaceImgLoad();
			};
		}
	}
	function onBaldMiiFaceImgLoad() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(miiFaceImg, 0, headYPos);
		ctx.drawImage(miiBodyImg, bodyXPos, bodyYPos, bodyWidth, bodyHeight);

		// we draw a portion of the bald mii on top of the normal mii to hide the mii's neck (see https://i.imgur.com/U0fpkwi.png)
		ctx.drawImage(baldMiiFaceImg, 186, 384, 140, 120, 186, headYPos + 384, 140, 120);
		canvas.style.filter = '';
	}

	if (!heightOverride && !buildOverride) {
		const faceMiiStudioUrl = mii.studioUrl({
			width: 512,
			bgColor: '13173300',
		});

		const faceMiiStudioSmileUrl = mii.studioUrl({
			width: 512,
			bgColor: '13173300',
			expression: 'smile'
		});

		// sets the new mii in the save tab to the new mii
		document.querySelector('.mii-comparison img.new-mii').src = faceMiiStudioUrl;
		document.querySelector('.mii-comparison.confirmed img.new-mii').src = faceMiiStudioSmileUrl;
	}
}

// This function updates a prop of the Mii and rerenders it
function updateMii(e) {
	const prop = e.target.name;
	let value = e.target.value || e.target.defaultValue;

	// if the value comes from a checkbox, we use the checked property
	if (value === 'on' || value === 'off') {
		value = e.target.checked;
	}

	// if the prop is disableSharing, we set the value to the opposite of the current value
	if (prop === 'disableSharing') {
		value = !value;
	}

	// Handle booleans, on/offs and strings
	if (value === 'true' || value === 'false') {
		mii[prop] = value === 'true';
	} else if (value === 'on' || value === 'off') {
		mii[prop] = value === 'on';
	} else if (isNaN(parseInt(value))) {
		mii[prop] = value;
	} else {
		mii[prop] = parseInt(value);
	}

	// if the user is editing the height or the build, we render the mii with the correct override, else we do a straight render
	if (prop === 'height') {
		renderMii(value, false);
	} else if (prop === 'build') {
		renderMii(false, value);
	} else {
		renderMii();
		console.log(mii);
	}
}

function handleCalendar(e) {
	const valueArray = e.target.value.split('-');
	const day = valueArray[2];
	const month = valueArray[1];

	mii.birthDay = parseInt(day);
	mii.birthMonth = parseInt(month);
}

function preventEmpty(e) {
	if (e.target.value !== '') return;

	e.target.value = e.target.defaultValue;
}

document.querySelectorAll('fieldset').forEach((fieldset) => {
	fieldset.addEventListener('change', updateMii);
});
document.querySelectorAll('input[type=\'range\']').forEach((input) => {
	input.addEventListener('input', updateMii);
});
document
	.querySelectorAll('input[type=\'text\'], input[type=\'number\']')
	.forEach((input) => {
		input.addEventListener('blur', preventEmpty);
	});
document
	.querySelector('input[type=\'date\']#birthDate')
	.addEventListener('change', handleCalendar);

// FORM

// Here we preselect the options corresponding to the Mii's current values
[
	'faceType',
	'skinColor',
	'makeupType',
	'wrinklesType',
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
	'beardType',
	'facialHairColor',
	'mustacheType',
	'moleEnabled',
	'gender',
	'favoriteColor',
].forEach((prop) => {
	const el = document.querySelector(`#${prop}${mii[prop]}`);
	if (el) {
		el.checked = true;
	}
	console.log(`[info] preselected value for ${prop}`);
});

['favorite', 'allowCopying'].forEach((prop) => {
	const el = document.querySelector(`#${prop}`);
	if (el) {
		el.checked = mii[prop];
	}
	console.log(`[info] preselected value for ${prop}`);
});

document.querySelector('#disableSharing').checked = !mii.disableSharing;
console.log('[info] preselected value for disableSharing');

[
	'eyebrowYPosition',
	'eyebrowSpacing',
	'eyebrowRotation',
	'eyebrowScale',
	'eyebrowVerticalStretch',
	'eyeYPosition',
	'eyeSpacing',
	'eyeRotation',
	'eyeScale',
	'eyeVerticalStretch',
	'noseYPosition',
	'noseScale',
	'mouthYPosition',
	'mouthScale',
	'mouthHorizontalStretch',
	'glassesYPosition',
	'glassesScale',
	'mustacheYPosition',
	'mustacheScale',
	'moleYPosition',
	'moleXPosition',
	'moleScale',
	'height',
	'build',
	'miiName',
	'creatorName',
].forEach((prop) => {
	document.querySelector(`#${prop}`).value = mii[prop];
	document.querySelector(`#${prop}`).defaultValue = mii[prop];
	console.log(`[info] preselected value for ${prop}`);
});

const paddedBirthDay = mii.birthDay.toString().padStart(2, '0');
const paddedBirthMonth = mii.birthMonth.toString().padStart(2, '0');
document.querySelector(
	'input[type=\'date\']#birthDate'
).value = `2024-${paddedBirthMonth}-${paddedBirthDay}`;
console.log('[info] preselected value for birthMonth && birthDay');

// TABS, SUBTABS, AND ALL THE INHERENT JANK

function openTab(e, tabType) {
	e.preventDefault();

	// Deselect all subpages
	document
		.querySelectorAll('.subtab.has-subpages .subpage.active')
		.forEach((el) => {
			el.classList?.remove('active');
		});
	document.querySelectorAll('.subtab.active').forEach((el) => {
		el.classList?.remove('active');
	});

	const buttonReplacement =
		tabType.charAt(0).toUpperCase() + tabType.slice(1);

	document.querySelectorAll(`.${tabType}.active`).forEach((el) => {
		el?.classList?.remove('active');
	});
	document.querySelectorAll(`.${tabType}btn.active`).forEach((el) => {
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

	setCanvasScale();

	// We hide all subpages
	document.querySelectorAll('.subpage').forEach((el) => {
		el.classList.remove('active');
	});

	// Selects the first subpage if there is one
	document.querySelector(`#${selectedID} .subpage`)?.classList?.add('active');
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
document
	.querySelector('#saveTab #saveButton')
	.addEventListener('click', (e) => {
		e.preventDefault();

		document
			.querySelector('#saveTab #saveButton')
			.classList.add('inactive', 'fade-out');
		document.querySelector('.tabs').style.pointerEvents = 'none';
		document.querySelector('.mii-comparison.confirmed').style.opacity = 1;
		document
			.querySelector('#saveTab p.save-prompt')
			.classList.add('fade-out');

		setTimeout(() => {
			document.querySelector(
				'.mii-comparison.unconfirmed'
			).style.opacity = 0;
		}, 500);

		setTimeout(() => {
			document
				.querySelector('.mii-comparison.confirmed .old-mii')
				.classList.add('fade-out');
			document
				.querySelector('.mii-comparison.confirmed svg')
				.classList.add('fade-out');
		}, 1500);

		setTimeout(() => {
			document
				.querySelector('.mii-comparison.confirmed .new-mii-wrapper')
				.classList.add('centered-mii-img');
		}, 2000);

		try {
			const miiData = mii.encode().toString('base64');
			const tokenType = document.cookie.split('; ').find(row => row.startsWith('token_type=')).split('=')[1];
			const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token=')).split('=')[1];

			fetch(`${config.api_base}/v1/user`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `${tokenType} ${decodeURIComponent(accessToken)}`
				},
				body: JSON.stringify({
					mii: {
						name: mii.miiName,
						primary: 'Y',
						data: miiData,
					}
				})
			})
				.then(({ status }) => {
					if (status === 200) {
						window.onbeforeunload = null;
						window.location.assign('/account');
					}
				})
				.catch(console.log);
		// CHECK IF MII IS VALID SERVERSIDE
		} catch (error) {
			alert(error);
		}
	});
