import createPopup from './popup.js';
import { generateRandom } from './random.js';

/* Variables */
let pets;
let slider;
let sliderContainer;
let currentPetsSet = [4, 0, 2];

/* Initialization */
getData();

/* Data handlers */
async function getData() {

    let data = await fetch("../../pets.json");
    pets = await data.json();
    sliderInit(pets);

    return pets;
}

/* Functions */
function getSlider() {
    return {
        containerPrev: document.getElementsByClassName('pets-container')[0],
        containerNext: document.getElementsByClassName('pets-container')[2],
        container: document.getElementsByClassName('pets-container')[1],
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

    let petsContainer = document.querySelector('.pets-container');
    let sliderContent = document.querySelector('.slider-content');

    petsContainer.insertAdjacentHTML('beforebegin', createPetsContainer(randomPetsSet(currentPetsSet, true)));
    sliderContent.innerHTML += createPetsContainer(randomPetsSet(currentPetsSet, true));

    slider = getSlider();
    sliderContainer = [slider.containerPrev, slider.container, slider.containerNext]

    /* Event handlers */
    slider.arrowRight.addEventListener('click', switchLeft);
    slider.arrowLeft.addEventListener('click', switchRight);
    addPopupHandlers(pets);
    console.log('Slider Initialized')
}

function switchLeft() {

    let petsContainer = createPetsContainer(randomPetsSet(currentPetsSet));

    sliderContainer.forEach(container => {
        container.classList.add('to-left');
    })

    setTimeout(() => {

        slider.containerPrev.remove();

        sliderContainer.forEach(container => {
            container.classList.remove('to-left');
        })

        slider.content.insertAdjacentHTML('beforeend', petsContainer);

        slider = getSlider();
        sliderContainer = [slider.containerPrev, slider.container, slider.containerNext];
        addPopupHandlers(pets);
    }, 500);

    console.log('Left');
}

function switchRight() {

    let petsContainer = createPetsContainer(randomPetsSet(currentPetsSet));

    sliderContainer.forEach(container => {
        container.classList.add('to-right');
    })

    setTimeout(() => {
        slider.containerNext.remove();
        sliderContainer.forEach(container => {
            container.classList.remove('to-right');
        })
        slider.containerPrev.insertAdjacentHTML('beforebegin', petsContainer);

        slider = getSlider();
        sliderContainer = [slider.containerPrev, slider.container, slider.containerNext];
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


function createPetsContainer(petsSet) {

    let container =
        `<div class="pets-container">
        <div class="pet-card">
            <img class="pet-card-image" src="${pets[petsSet[0]].img}" alt="${pets[petsSet[0]].name}">
            <p class="pet-card-title">
                ${pets[petsSet[0]].name}
            </p>
            <button type="button" class="pet-card-button">Learn more</button>
        </div>
        <div class="pet-card">
            <img class="pet-card-image" src="${pets[petsSet[1]].img}" alt="${pets[petsSet[1]].name}">
            <p class="pet-card-title">
                ${pets[petsSet[1]].name}
            </p>
            <button type="button" class="pet-card-button">Learn more</button>
        </div>
        <div class="pet-card">
            <img class="pet-card-image" src="${pets[petsSet[2]].img}" alt="${pets[petsSet[2]].name}">
            <p class="pet-card-title">
                ${pets[petsSet[2]].name}
            </p>
            <button type="button" class="pet-card-button">Learn more</button>
        </div>
    </div>`

    return container;
}