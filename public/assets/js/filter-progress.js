const progressCards = document.getElementsByClassName('purple-card');

function showWithFilter(filter){
    for (const card of progressCards){
        const types = card.getAttribute('type');
        if (filter === "none" || types.toLowerCase().includes(filter)){
            card.classList.remove('off');
        }
        else {
            card.classList.add('off');
        }
    }
}

const buttons = document.getElementById('filter-container').querySelectorAll('button');
let selectedButton = buttons[0];
for (const button of buttons){
    button.addEventListener('click',(event) => {
        selectedButton.classList.remove('primary');
        selectedButton = event.target;
        selectedButton.classList.add('primary');
        showWithFilter(event.target.id);
    })
}