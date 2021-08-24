const form = document.querySelector(".localization-form");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href=`https://prete.herokuapp.com/?url=${e.target[0].value}`
});

