/*

index.js -
the main javascript file

*/

// set some variables
var bg = document.getElementById("hp-bg"),
    index = 0,
    imageList = [ "/assets/images/bg1.gif", "/assets/images/bg2.gif" ]

// set the first image
bg.src = imageList[index]
index++

setInterval(() => {
  
  if (index === imageList.length) {
    
    index = 0
    
  }
  
  bg.src = imageList[index]
  
  index++
  
}, 5000)