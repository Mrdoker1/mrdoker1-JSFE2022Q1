/* Variables */
const sticky = {
    header: document.querySelector('header'),
    burger: document.querySelector('.burger-menu')
}

/* Handlers */
window.onscroll = () => {
    if (window.pageYOffset > 55) {
        sticky.header.classList.add('sticky');

    } else {
        sticky.header.classList.remove('sticky');
        sticky.header.classList.remove('hide-background');
    }
};

window.onresize = () => {
    if (sticky.burger.classList.contains('show')) {
        sticky.header.classList.add('hide-background');
    }

    if (window.pageYOffset < 55) {
        sticky.header.classList.remove('hide-background');
    }
}