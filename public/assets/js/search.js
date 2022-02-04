document.getElementById('searchBox').addEventListener('input',function() {
	const word = document.getElementById('searchBox').textContent;
	fetchResults(word);
});

function fetchResults(word) {
	fetch(`/docs/search/${word}`)
		.then(res => res.json())
		.then(data => {
			const currentDiv = document.getElementById('result');
			currentDiv.classList.remove('resultcard');

			const elements = document.getElementsByClassName('resultcard');
			while(elements.length > 0){
				elements[0].parentNode.removeChild(elements[0]);
			}
			for (let i = 0;i < data.ResponseArray.length;i++){
				const newDiv = document.createElement('div');
				newDiv.className = 'resultcard';
				const newA = document.createElement("a")
				newA.setAttribute('href',`${window.location.href.replace('search','')}${data.ResponseArray[i].replace('.md','/')}#:~:text=${word}`);
				const newContent = document.createTextNode(data.ResponseArray[i].replace('.md',''));
				newDiv.appendChild(newA)
				newA.appendChild(newContent);
				currentDiv.parentNode.insertBefore(newDiv, currentDiv.nextSibling);
			}
		})
		.catch(function () {
			const elements = document.getElementsByClassName('resultcard');
			while(elements.length > 0){
				elements[0].parentNode.removeChild(elements[0]);
			}
		});
}