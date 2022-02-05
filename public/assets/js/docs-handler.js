const sidebar = document.getElementsByClassName('sidebar')[0];
const button = document.getElementById('docs-mobile-button')
button.addEventListener('click',function() {
    sidebar.style.display = "block"
    
})
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !button.contains(e.target) && sidebar.style.display === "block" && window.screen.width < 930) {
        sidebar.style.display = "none"
    }
})
window.addEventListener("resize",() => {
    if (window.screen.width > 930 && sidebar.style.display === "none") {
       sidebar.style.display = "block"
        sidebar.style.width = "calc(clamp(270px, 30vw, 500px))"
    }
    if (window.screen.width < 930){
        sidebar.style.width = "60mm"
        sidebar.style.display = "none"
    }
})
function selectSidebarElement(element) {
    if (!element){return}
    element.scrollIntoView({ block: "center" });
    element.classList.add('active');
  }
  var aURL = location.pathname.split("#")[0]
  if (aURL.endsWith("/")){aURL = aURL.replace(/.$/,"")}
  selectSidebarElement(document.querySelector(`div.sidebar a[href='${aURL}']`));