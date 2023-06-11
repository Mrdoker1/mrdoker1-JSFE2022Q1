import createPopup from './popup.js';
import { generateArrayRandomNumber } from './random.js';

/* Variables */
let pets;
let pageAmount = 16;
let petsContainerSet;
let pagination = {
    petsSection: document.querySelector('.pets-content-section'),
    firstPage: document.getElementById('first-page'),
    prevPage: document.getElementById('prev-page'),
    nextPage: document.getElementById('next-page'),
    lastPage: document.getElementById('last-page'),
    pageNumber: document.getElementById('page-number'),
}

/* Initialization */
getData();

/* Data handlers */
async function getData() {

    let data = await fetch("../../pets.json");
    pets = await data.json();
    petsContainerSet = createPetsContainerSet(pageAmount, pets);
    changePaginationSection();
    checkMedia();
    return pets;
}

/* Functions */
function addPopupHandlers(pets) {
    document.querySelectorAll('.pet-card').forEach(element => {
        if (!element.onclick) {
            element.onclick = function() { document.querySelector('main').appendChild(createPopup(element.children[1].innerHTML, pets)) }
        }
    })
}

function disable(element) {

    element.setAttribute('disabled', 'disabled');
    element.classList.add('button-inactive');
}

function enable(element) {

    element.removeAttribute('disabled');
    element.classList.remove('button-inactive');
}

function nextPage() {

    let currentPage = pagination.pageNumber.innerHTML;

    if (currentPage > 0) {
        enable(pagination.prevPage);
        enable(pagination.firstPage);
    }

    if (currentPage <= pageAmount) {

        if (currentPage < pageAmount) {
            pagination.pageNumber.innerHTML++;
            changePaginationSection(pagination.pageNumber.innerHTML)
        }
        if (+currentPage + 1 == pageAmount) {
            disable(pagination.nextPage);
            disable(pagination.lastPage);
        }
    }
}

function prevPage() {

    let currentPage = pagination.pageNumber.innerHTML;

    if (currentPage <= pageAmount) {
        enable(pagination.nextPage);
        enable(pagination.lastPage);
    }

    if (currentPage >= 1) {

        if (currentPage > 1) {
            pagination.pageNumber.innerHTML--;
            changePaginationSection(pagination.pageNumber.innerHTML)
        }
        if (+currentPage - 1 == 1) {
            disable(pagination.prevPage);
            disable(pagination.firstPage);
        }
    }
}

function lastPage() {

    let pageNumber = pagination.pageNumber.innerHTML = pageAmount;

    enable(pagination.prevPage);
    enable(pagination.firstPage);

    disable(pagination.nextPage);
    disable(pagination.lastPage);

    changePaginationSection(pageNumber);
}

function firstPage() {
    let pageNumber = pagination.pageNumber.innerHTML = 1;

    enable(pagination.nextPage);
    enable(pagination.lastPage);

    disable(pagination.prevPage);
    disable(pagination.firstPage);

    changePaginationSection(pageNumber);
}

function changePaginationSection(page = 1) {

    pagination.petsSection.replaceChildren();

    petsContainerSet[page - 1].forEach(element => {
        pagination.petsSection.appendChild(element);
    })

    addPopupHandlers(pets)
}

function createPetsContainerSet(amount = 6, pets) {

    let petsContainerSet = [];

    for (let i = 0; i < amount; i++) {
        petsContainerSet.push(createPetsContainer(8, pets))
    }
    return petsContainerSet;
}

function createPetsContainer(amount = 8, pets) {
    let petContainer = [];

    generateArrayRandomNumber(0, amount - 1).forEach(element => {
        petContainer.push(createPet(pets[Object.keys(pets)[element]]));
    })
    return petContainer
}

function createPet(pet) {

    let petCard = document.createElement('div');
    petCard.classList.add('pet-card');

    petCard.innerHTML =
        `<img class="pet-card-image" src="${pet.img}" alt="${pet.name}">
            <p class="pet-card-title">${pet.name}</p>
        <button type="button" class="pet-card-button">Learn more</button>`

    return petCard;
}

function checkMedia() {
    let mobile = window.matchMedia('(max-width: 768px)');
    let tablet = window.matchMedia('(max-width: 1279px)');

    if (mobile.matches) {
        console.log('Cards amount 16');
        pageAmount = 16;
    } else if (tablet.matches) {
        console.log('Cards amount 8');
        pageAmount = 8;
    } else {
        console.log('Cards amount 6');
        pageAmount = 6;
    }
}

/* Event handlers */
//window.addEventListener('resize', checkMedia);

pagination.nextPage.addEventListener('click', nextPage);
pagination.prevPage.addEventListener('click', prevPage);
pagination.lastPage.addEventListener('click', lastPage);
pagination.firstPage.addEventListener('click', firstPage);