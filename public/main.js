// I stole this code.
for(let el of document.querySelectorAll("details")) {
	el.addEventListener("click", evt => {
		// Close detail elements if clicking elsewhere
		let path = evt.path || [];
		document.querySelectorAll("details[open]").forEach(el => {
			if (!path.includes(el)) {
				el.removeAttribute("open");
			}
		});
	});
}
