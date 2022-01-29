document.getElementById("searchBox").addEventListener(`input`,function() {
    myFunction()
})
function myFunction() {
    var Word = document.getElementById("searchBox").textContent
    FindWordInDocuments(Word)
  }
  function FindWordInDocuments(Word){
    document.getElementById("test").textContent = Word
  }