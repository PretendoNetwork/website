const sidebar = document.getElementsByClassName('sidebar')[0];
const button = document.getElementById('docs-mobile-button')
button.addEventListener('click',function() {
    sidebar.style.display = "block"
    
})
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !button.contains(e.target) && sidebar.style.display === "block" && window.screen.width < 650) {
        sidebar.style.display = "none"
    }
})
window.addEventListener("resize",() => {
    if (window.screen.width > 650 && sidebar.style.display === "none") {
       sidebar.style.display = "block"
        sidebar.style.width = "calc(clamp(270px, 30vw, 500px))"
    }
    if (window.screen.width < 650){
        sidebar.style.width = "60mm"
        sidebar.style.display = "none"
    }
})
function selectSidebarElement(element,blocktype) {
    if (!element){return}
    element.scrollIntoView({ block: blocktype || "center" });
   if(!blocktype){ element.classList.add('active');}
  }
  let aURL = location.pathname.split("/")
  let hrefURL = aURL[2]
  if (hrefURL.includes("errorcodes")) {hrefURL += `/${aURL[3]}`}
  if (document.querySelector(`div.sidebar a[href='/docs/${hrefURL}']`)) {
  selectSidebarElement(document.querySelector(`div.sidebar a[href='/docs/${hrefURL}']`));
  }else{
      //Assumes that Search and the Docs with Error Codes Mixed Together so this *tries* to find it
    let elems = document.body.getElementsByClassName("section");
    for (let section = 0;section < elems.length;section++){
    for (let eleValue = 0;eleValue < elems[section].children.length;eleValue++){
     if (elems[section].children[eleValue].textContent.includes(aURL[3])){
        selectSidebarElement(elems[section].children[eleValue]);break;}
    }
    if (elems[section].children[0].textContent.toLowerCase().includes(aURL[2].split("-")[0])) {
        selectSidebarElement(elems[section].children[0],"start");break;
    }
  }
}