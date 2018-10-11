/* eslint-env browser */

/*

index.js -
the main javascript file

*/

// set some variables
const bg = document.getElementById('hp-bg');
let index = 0;
const imageList = [ '/assets/images/bg1.gif', '/assets/images/bg2.gif' ];

// set the first image
bg.src = imageList[index];
index++;

setInterval(() => {
  
	if (index === imageList.length) {
		index = 0;
	}
  
	bg.src = imageList[index];

	index++;
}, 5000);