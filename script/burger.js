/* Variables */
const websiteLogo = document.querySelector('.logo');

const burgerAdditional = {
    logo: document.querySelector('.logo'),
    body: document.querySelector('body'),
    header: document.querySelector('header')
}

const burger = {
    state: false,
    button: document.querySelector('.burger-button'),
    background: document.querySelector('.menu-background'),
    menu: document.querySelector('.burger-menu'),
    menuList: document.querySelector('.mobile-menu-list')
}

/* Functions */
function BurgerToggle() {

    if (burger.state) {
        burger.state = false;
        burgerAdditional.header.classList.remove('hide-background');
    } else {
        burger.state = true;
        burgerAdditional.header.classList.add('hide-background');
    }

    burger.button.classList.toggle('rotate');
    burger.background.classList.toggle('show');
    burger.menu.classList.toggle('show');
    burgerAdditional.logo.classList.toggle('fade');
    burgerAdditional.body.classList.toggle('no-scroll');
};

/* Event handlers */
burger.button.addEventListener('click', BurgerToggle);
burger.menuList.addEventListener('click', BurgerToggle);
burger.background.addEventListener('click', BurgerToggle);