export default createPopup

/* Functions */
function createPopup(pet, pets) {

    console.log('Create ' + pet.trim() + ' Popup')

    let petObj;
    let page = {
        main: document.querySelector('main'),
        body: document.querySelector('body')
    }

    pets.forEach(element => {
        if (element.name == pet.trim()) {
            petObj = element;
        }
    });

    let popup = document.createElement('div')
    popup.classList.add('popup-background', 'show')
    popup.innerHTML = `
    <div class="popup-container">
        <button class="popup-button">
      </button>
        <div class="popup-window">
            <img class="popup-image" src="${petObj.img}">
            <div class="popup-content">
                <h3 class="popup-content-title">
                ${petObj.name}
                </h3>
                <h4 class="popup-content-subtitle">
                ${petObj.type} - ${petObj.breed}
                </h4>
                <h5 class="popup-content-description">
                ${petObj.description}
                </h5>
                <ul class="popup-list">
                    <li class="popup-list-item">
                        <span><b>Age:</b> ${petObj.age}</span>
                    </li>
                    <li class="popup-list-item">
                        <span><b>Inoculations:</b> ${petObj.inoculations}</span>
                    </li>
                    <li class="popup-list-item">
                        <span><b>Diseases:</b> ${petObj.diseases}</span>
                    </li>
                    <li class="popup-list-item">
                        <span><b>Parasites:</b> ${petObj.parasites}</span>
                    </li>
                    <ul>
                    </ul>
                </ul>
            </div>
        </div>
    </div>`

    page.body.style.overflow = 'hidden';

    popup.addEventListener('click', (e) => {
        page.body.style.removeProperty('overflow');

        let popup = document.querySelector('.popup-background');
        let popupContainer = document.querySelector('.popup-container');
        let close = document.querySelector('.popup-button')
        if (e.target == popup || e.target == popupContainer || e.target == close) {
            popup.remove();
        }
    })

    popup.children[0].children[1].addEventListener('mouseenter', () => {
        document.querySelector('.popup-button').classList.remove('close');
    })

    popup.children[0].children[1].addEventListener('mouseleave', () => {
        document.querySelector('.popup-button').classList.add('close');
    })

    return popup;
}