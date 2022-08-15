const openSidebarBtn = document.querySelector('#openSidebar');
const content = document.querySelector('div.content');
openSidebarBtn.addEventListener('click', function() {
	const sidebar = document.querySelector('.sidebar');
	sidebar.classList.toggle('open');
	content.classList.toggle('open-sidebar');
});
