function dropDownMenu(){
    const menu = document.querySelectorAll('nav ul li')
    menu.forEach(i => {
        i.classList.toggle('show-menu')
    })
}

//dropdown menu
const btnIconMenu = document.querySelector('.icon-menu')
btnIconMenu.addEventListener('click', dropDownMenu)

const quotes = [
    "Whether you think you can or you can't, you're right !",
    "Just do it, don't think too much !!",
    "Code is like humor. When you have to explain it, it’s bad",
    "Simplicity is the soul of efficiency",
    "Make it work, make it right, make it fast",
]

//random quote of the day
const quoteEl = document.querySelector('.quote q')
quoteEl.innerText = quotes[Math.floor(Math.random() * quotes.length)]
