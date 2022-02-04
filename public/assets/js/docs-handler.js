const sidebar = document.getElementsByClassName('sidebar')[0];
const button = document.getElementById('docs-mobile-button')
button.addEventListener('click',function() {
    sidebar.style.visibility = "visible"
    sidebar.style.width = "60mm"
})
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !button.contains(e.target) && sidebar.style.visibility === "visible" && window.screen.width < 930) {
        sidebar.style.visibility = "hidden"
        sidebar.style.width = "0mm"   
    }
})
window.addEventListener("resize",() => {
    if (window.screen.width > 930 && sidebar.style.visibility === "hidden") {
        sidebar.style.visibility = "visible"
        sidebar.style.width = "calc(clamp(270px, 30vw, 500px))"
    }
    if (window.screen.width < 930){
        sidebar.style.visibility = "hidden"
        sidebar.style.width = "0mm"
    }
})
function selectSidebarElement(element) {
    if (!element){return}
    element.scrollIntoView({ block: "center" });
    element.classList.add('active');
  }
  selectSidebarElement(document.querySelector(`div.sidebar a[href='${location.pathname}']`));