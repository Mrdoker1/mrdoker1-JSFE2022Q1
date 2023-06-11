import createPopup from '../../script/popup.js';
import { generateRandom } from '../../script/random.js';

/* Variables */
let pets;
let slider;
let containerSize = 1;
let sliderContainer;
let currentPetsSet = [4, 0, 2];
let windowSize = window.window.innerWidth;


if (windowSize >= 1280) {
    containerSize = 3;
    console.log('1280');
} else if (windowSize >= 768 && windowSize < 1280) {
    containerSize = 2;
    console.log('768');
} else if (windowSize < 768) {
    containerSize = 1;
    console.log('320');
}

/* Initialization */
getData();

/* Data handlers */
async function getData() {

    slider = getSlider();
    let data = await fetch("../../pets.json");
    pets = await data.json();
    sliderInit(pets);

    return pets;
}

window.addEventListener("resize", () => {
    if (windowSize >= 1280) {
        containerSize = 3;
        console.log('1280');
    } else if (windowSize >= 768 && windowSize < 1280) {
        containerSize = 2;
        console.log('768');
    } else if (windowSize < 768) {
        containerSize = 1;
        console.log('320');
    }
});

/* Functions */
function getSlider() {
    return {
        containerPrev: document.getElementsByClassName('pets-container')[0],
        container: document.getElementsByClassName('pets-container')[1],
        containerNext: document.getElementsByClassName('pets-container')[2],
        arrowRight: document.querySelector('.slider-arrow.arrow-right'),
        arrowLeft: document.querySelector('.slider-arrow.arrow-left'),
        content: document.querySelector('.slider-content')
    }
}

function addPopupHandlers(pets) {
    document.querySelectorAll('.pet-card').forEach(element => {
        if (!element.onclick) {
            element.onclick = function() { document.querySelector('main').appendChild(createPopup(element.children[1].innerHTML, pets)) }
        }
    })
}

function sliderInit(pets) {

    for (let i = 0; i < 3; i++) {
        slider.content.append(createPetsContainer(randomPetsSet(currentPetsSet, true), containerSize));
    }

    /* Event handlers */
    slider.arrowRight.addEventListener('click', switchLeft);
    slider.arrowLeft.addEventListener('click', switchRight);
    addPopupHandlers(pets);
    console.log('Slider Initialized')
}

function switchLeft() {

    slider = getSlider();
    sliderContainer = [slider.containerPrev, slider.container, slider.containerNext]
    let petsContainer = createPetsContainerHTML(randomPetsSet(currentPetsSet), containerSize);

    sliderContainer.forEach(container => {
        container.classList.add('to-left');
    })

    setTimeout(() => {
        sliderContainer.forEach(container => {
            container.classList.remove('to-left');
        })

        slider.containerPrev.innerHTML = slider.container.innerHTML;
        slider.container.innerHTML = slider.containerNext.innerHTML;
        slider.containerNext.innerHTML = petsContainer;

        addPopupHandlers(pets);
    }, 500);
    console.log('Left');
}

function switchRight() {

    slider = getSlider();
    sliderContainer = [slider.containerPrev, slider.container, slider.containerNext]
    let petsContainer = createPetsContainerHTML(randomPetsSet(currentPetsSet), containerSize);

    sliderContainer.forEach(container => {
        container.classList.add('to-right');
    })

    setTimeout(() => {
        sliderContainer.forEach(container => {
            container.classList.remove('to-right');
        })

        slider.containerNext.innerHTML = slider.container.innerHTML;
        slider.container.innerHTML = slider.containerPrev.innerHTML;
        slider.containerPrev.innerHTML = petsContainer;

        addPopupHandlers(pets);
    }, 500);

    console.log('Right');
}

function randomPetsSet(currentSet, init = false) {

    let newPetsSet = []

    while (newPetsSet.length != 3) {
        let num = generateRandom(0, 7, currentSet);
        if (!newPetsSet.includes(num)) {
            newPetsSet.push(num);
        }
    }

    if (!init) {
        if (newPetsSet.join('') != currentPetsSet.join('')) {
            currentPetsSet = [...newPetsSet];
        }
    }

    return newPetsSet
}

function createPetsContainer(petsSet, size) {

    let div = document.createElement('div');
    div.className = "pets-container";

    for (let i = 0; i < size; i++) {
        div.innerHTML += `
        <div class="pet-card">
            <img class="pet-card-image" src="${pets[petsSet[i]].img}" alt="${pets[petsSet[i]].name}">
            <p class="pet-card-title">
                ${pets[petsSet[i]].name}
            </p>
            <button type="button" class="pet-card-button">Learn more</button>
        </div>`
    }
    return div;
}

function createPetsContainerHTML(petsSet, size) {

    let div = '';

    for (let i = 0; i < size; i++) {
        div += `
        <div class="pet-card">
            <img class="pet-card-image" src="${pets[petsSet[i]].img}" alt="${pets[petsSet[i]].name}">
            <p class="pet-card-title">
                ${pets[petsSet[i]].name}
            </p>
            <button type="button" class="pet-card-button">Learn more</button>
        </div>`
    }

    return div;
}