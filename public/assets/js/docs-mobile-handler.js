const sidebar = document.getElementsByClassName('sidebar')[0];
const button = document.getElementById('docs-mobile-button')
button.addEventListener('click',function() {
    sidebar.style.visibility = "visible"
    sidebar.style.width = "60mm"
})
document.getElementsByClassName('content')[0].addEventListener('click', (e) => {
    sidebar.style.visibility = "hidden"
    sidebar.style.width = "0mm"
})