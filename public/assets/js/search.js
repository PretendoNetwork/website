var previousWord = ""
document.getElementById('searchBox').addEventListener('input',function() {
	const word = document.getElementById('searchBox').textContent;
	if (previousWord === word){
		//Stupid Solution to Stop Enter Keys Input (if there is a better way please fix this)
		document.getElementById('searchBox').textContent = previousWord;
	}
	else if (word === ""){return}
	else {previousWord = word}
	fetchResults(word);
});

function fetchResults(word) {
	const elements = document.getElementsByClassName('resultcard');
	const currentDiv = document.getElementById('result');
	fetch(`/docs/search/${word}`)
		.then(res => res.json())
		.then(data => {
			currentDiv.textContent = ""
			currentDiv.classList.remove('resultcard');

			while(elements.length > 0){
				elements[0].parentNode.removeChild(elements[0]);
			}
			if (data.ResponseArray.length === 0){
				currentDiv.textContent = "We could't find what you were looking for."
			}
			for (let i = 0;i < data.ResponseArray.length;i++){
				const newDiv = document.createElement('div');
				newDiv.className = 'resultcard';
				const newA = document.createElement("a")
				newA.setAttribute('href',`${window.location.href.replace('search','')}${data.ResponseArray[i].replace('.md','/')}${word}`);
				const newContent = document.createTextNode(data.ResponseArray[i].replace('.md','').replaceAll('-',' '));
				newDiv.appendChild(newA)
				newA.appendChild(newContent);
				currentDiv.parentNode.insertBefore(newDiv, currentDiv.nextSibling);
			}
		})
		.catch(function () {
			while(elements.length > 0){
				elements[0].parentNode.removeChild(elements[0]);
			}
			currentDiv.textContent = "Something went wrong."
		});
}