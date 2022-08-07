const openSidebarBtn = document.querySelector('#openSidebar');
openSidebarBtn.addEventListener('click', function() {
	const sidebar = document.querySelector('.sidebar');
	sidebar.classList.toggle('open');
});
