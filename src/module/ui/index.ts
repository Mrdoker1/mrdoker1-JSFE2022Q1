//Interface
import IWinnerItem from '../../interface/IWinnerItem';
import IState from '../../interface/IState';

export default class Render {
    state: IState;
    constructor(state: IState) {
        this.state = state;
    }

    car(color: string, id: string) {
        // inline it
        return `
        <svg width="80" height="36" viewBox="0 0 80 36" fill="${color}" xmlns="http://www.w3.org/2000/svg" data-svg-id="${id}">
            <path d="M40 0H21.8182L10.9091 9.47368H7.27273C3.23636 9.47368 0 12.8463 0 17.0526V28.4211H7.89091C9.45455 32.9684 13.5636 36 18.1818 36C22.8 36 26.9091 32.9684 28.4364 28.4211H51.5273C53.0909 32.9684 57.2 36 61.8182 36C66.4364 36 70.5455 32.9684 72.0727 28.4211H80V24.6316C80 20.4253 76.2545 19.0611 72.7273 17.0526L40 0ZM15.4545 13.2632L23.6364 5.68421H38.1818L52.7273 13.2632H15.4545ZM18.1818 18.9474C19.6285 18.9474 21.0158 19.5462 22.0388 20.6122C23.0617 21.6782 23.6364 23.124 23.6364 24.6316C23.6364 26.1391 23.0617 27.5849 22.0388 28.6509C21.0158 29.7169 19.6285 30.3158 18.1818 30.3158C16.7352 30.3158 15.3478 29.7169 14.3249 28.6509C13.3019 27.5849 12.7273 26.1391 12.7273 24.6316C12.7273 23.124 13.3019 21.6782 14.3249 20.6122C15.3478 19.5462 16.7352 18.9474 18.1818 18.9474V18.9474ZM61.8182 18.9474C63.2648 18.9474 64.6522 19.5462 65.6751 20.6122C66.6981 21.6782 67.2727 23.124 67.2727 24.6316C67.2727 26.1391 66.6981 27.5849 65.6751 28.6509C64.6522 29.7169 63.2648 30.3158 61.8182 30.3158C60.3715 30.3158 58.9842 29.7169 57.9612 28.6509C56.9383 27.5849 56.3636 26.1391 56.3636 24.6316C56.3636 23.124 56.9383 21.6782 57.9612 20.6122C58.9842 19.5462 60.3715 18.9474 61.8182 18.9474Z"
            fill="${color}">
        </svg>`;
    }

    flag(id: string) {
        return `
        <svg width="23" height="36" viewBox="0 0 23 36" fill="none" xmlns="http://www.w3.org/2000/svg" data-flag="${id}">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1 36L1 0L3.5 2L5 3.09094L5 36H1Z" fill="black"/>
            <path d="M1 0L23 17H1V0Z" fill="${this.state.color}"/>
        </svg>`;
    }

    carRoot(car: string, name: string, id: string) {
        const template = `
            <div class="car-root-head">
                <div class="car-root-heading">
                    <button class="car-root-edit" data-edit="${id}" value="${id}">edit</button>
                    ${name}
                </div>
                <button class="car-root-remove" data-remove="${id}" value="${id}">remove</button>
            </div>
            <div class="car-root-content">
                <div class="car-root-control">
                    <button class="car-root-a" data-start="${id}" value="${id}">A</button>
                    <button class="car-root-b" data-stop="${id}" value="${id}" disabled>B</button>
                </div>
                <div class="car-root">
                    ${car}
                </div>
                ${this.flag(id)}
            </div>`;

        const root = document.createElement('div');
        root.classList.add('car-root-wrapper');
        root.dataset.id = id;
        root.innerHTML = template;
        return root;
    }

    navigation() {
        const template = `
        <button class="garage">To Garage</button>
        <button class="winners">To Winners</button>`;
        const nav = document.createElement('div');
        nav.classList.add('nav');
        nav.innerHTML = template;
        return nav;
    }

    garageControl() {
        const template = `
        <div class="inputs-wrapper">
            <div class="inputs-create">
                <input type="text" id="create-input" name="fname" value="${this.state.garage.inputs.create}">
                <input type="color" id="create-color" name="input-color" value="${this.state.garage.colors.create}">
                <button id="create-button">create</button>
            </div>
            <div class="inputs-update">
                <input type="text" id="update-input" name="fname" value="${this.state.garage.inputs.update}" ${this.state.garage.update}>
                <input type="color" id="update-color" name="update-color" value="${this.state.garage.colors.update}" ${this.state.garage.update}>
                <button id="update-button" data-update-id="${this.state.garage.updateID}" ${this.state.garage.update}>update</button>
            </div>
        </div>
        <div class="garage-control-buttons">
            <button class="race">race</button>
            <button class="reset">reset</button>
            <button class="generate-hundred">generate 100</button>
        </div>`;
        const controls = document.createElement('div');
        controls.classList.add('garage-control');
        controls.innerHTML = template;
        return controls;
    }

    pagination() {
        const template = `
        <button class="prev">prev</button>
        <button class="next">next</button>`;
        const pag = document.createElement('div');
        pag.classList.add('pag');
        pag.innerHTML = template;
        return pag;
    }

    winner(winner: IWinnerItem) {
        return `
        <tr>
            <td class="winner-id">${winner.id}</td>
            <td>${this.car(winner.car.color, winner.car.id)}</td>
            <td>${winner.car.name}</td>
            <td>${winner.wins}</td>
            <td>${winner.time}</td>
        </tr>`;
    }

    winnerBoard(name: string, time: number) {
        const template = `
            <div class="winner-info">
                ${name} is winner! His time is ${time}s;
            </div>
        `;
        const winnerBoard = document.createElement('div');
        winnerBoard.classList.add('winner-board');
        winnerBoard.innerHTML = template;
        return winnerBoard;
    }

    author() {
        const template = `
            <div class="author-info">
                <a href="https://rs.school/js/" class="rss">RS School</a>
                <a href="https://github.com/Mrdoker1" class="github nav-link">Viachas Kul</a>
            </div>`;

        const root = document.createElement('div');
        root.classList.add('author');
        root.innerHTML = template;
        return root;
    }
}
