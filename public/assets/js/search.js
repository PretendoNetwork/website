document.getElementById("searchBox").addEventListener(`input`,function() {
  var Word = document.getElementById("searchBox").textContent
  httpGetAsync(Word)
})

function httpGetAsync(word){
   fetch(window.location.href + "/" + word)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const currentDiv = document.getElementById("result");
    currentDiv.classList.remove("resultcard")

    var elements = document.getElementsByClassName("resultcard");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    for (var i = 0;i < data.ResopnseArray.length;i++){
    var newDiv = document.createElement("div")
    newDiv.className = "resultcard"
    newDiv.setAttribute("href",`${window.location.href.replace("search","")}${data.ResopnseArray[i].replace(".md","/")}#:~:text=${word}`)
    const newContent = document.createTextNode(data.ResopnseArray[i]);
    newDiv.appendChild(newContent);
    currentDiv.parentNode.insertBefore(newDiv, currentDiv.nextSibling);
    }
  })
 .catch(function () {
    var elements = document.getElementsByClassName("resultcard");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
  }
 });
}