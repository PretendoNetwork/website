// This file gets automatically bundled with browserify when running the start script. This also means that after any update you're gonna need to restart the server to see any changes.

// Prevent the user from reloading or leaving the page
window.addEventListener('beforeunload', function (e) {
	e?.preventDefault();
	e.returnValue = '';
});

let currentTab = '';

// this makes it so the canvas fits in the target element
function setCanvasScale() {
	let targetX;
	let targetY;

	if (currentTab === 'size'||
		currentTab === 'miiscTab' ||
		currentTab === 'gender' ||
		currentTab === 'favoriteColor' ||
		currentTab === 'saveTab' ||
		window.innerWidth <= 1080) {
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

// an array of mii bodies which can be accessed with bodies[mii.gender][mii.favoriteColor]
const bodies = [
	[
		'1/2/9/302cf838e',
		'a/1/a/f566b5882',
		'8/0/5/4e6c8e40f',
		'c/9/d/debd43468',
		'7/9/c/385972617',
		'b/5/b/cd851b631',
		'9/0/a/e1f7181a6',
		'6/3/4/cf2bc03a3',
		'7/a/d/5eaa9736c',
		'8/2/d/3a32ad1cd',
		'0/9/0/cc8eb01cc',
		'9/a/3/d0e61957d'
	],
	[
		'7/e/8/606f4fe49',
		'7/a/b/1cf206fac',
		'd/e/2/526e11ecf',
		'f/0/f/52cae5867',
		'c/1/a/7436d0d18',
		'e/6/4/5c0a064e8',
		'f/5/7/20e676637',
		'0/0/e/5b151a232',
		'8/c/e/344a00817',
		'7/d/d/81a00dd54',
		'3/b/f/29b5e1311',
		'c/8/e/766672439'
	]
];

// MII RENDERER

const Mii = require('mii-js');

// The Mii data is stored in a script tag in the HTML, so we can just grab it and then remove the element
const encodedUserMiiData = document.querySelector(
	'script#encodedUserMiiData'
).textContent;
document.querySelector('script#encodedUserMiiData').remove();
console.log('encodedMiiData', encodedUserMiiData);

// We initialize the Mii object
const mii = new Mii(Buffer.from(encodedUserMiiData, 'base64'));

// We set the img sources for the unedited miis in the save animation
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
document.querySelector('.mii-comparison.confirmed img.old-mii').src =
	miiStudioSorrowUrl;

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
		miiBodyImg.src = `https://mii-studio.akamaized.net/editor/1/webp/1024/${bodies[mii.gender][mii.favoriteColor]}.webp`;
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
		ctx.drawImage(baldMiiFaceImg, 196, 384, 120, 120, 196, headYPos + 384, 120, 120);
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

	currentTab = selectedID;
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

		const miiData = mii.encode().toString('base64');

		alert(miiData);
		console.log('mii data:', miiData);
		// CHECK IF MII IS VALID SERVERSIDE
	});
