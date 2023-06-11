//API
import Data from '../../module/api';

//Interface
import ICarBody from '../../interface/ICarBody';
import IWinnerItem from '../../interface/IWinnerItem';
import IState from '../../interface/IState';

//Style
import '../../global.scss';
import './index.scss';

//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';
import getHTMLButtonElement from '../../utils/getHTMLButtonElement';
import getSVGElement from '../../utils/getSVGElement';
import Random from '../random';
import Particles from '../particles';

//UI
import Render from '../ui';

//Enums
import { Pages, Sort, Order } from '../../module/enums';

export default class App {
    data: Data;
    state: IState;
    defaultColor: string;
    constructor(base: string) {
        this.data = new Data(base);
        this.defaultColor = '#e66465';
        this.state = {
            turbo: false,
            color: this.defaultColor,
            root: 0,
            winners: {
                page: 1,
                count: 0,
                sort: Sort.wins,
                order: Order.ASC,
            },
            garage: {
                roots: null,
                page: 1,
                size: 0,
                inputs: {
                    create: '',
                    update: '',
                },
                colors: {
                    create: this.defaultColor,
                    update: this.defaultColor,
                },
                update: 'disabled',
                updateID: '',
            },
        };
    }
    start() {
        this.createPage(Pages.Garage);
    }

    //Create

    async createPage(page: Pages) {
        let pageComponents: Array<Node> = [];
        const render = new Render(this.state);
        switch (page) {
            case 1:
                let carRoots;
                if (!this.state.garage.roots) {
                    carRoots = await this.createCarRoots(this.state.garage.page).then((response) => {
                        return response;
                    });
                } else {
                    carRoots = this.state.garage.roots;
                }
                pageComponents = [
                    render.navigation(),
                    render.garageControl(),
                    carRoots,
                    render.pagination(),
                    render.author(),
                ];
                break;
            case 2:
                pageComponents = [
                    render.navigation(),
                    await this.createWinnersTable(this.state.winners.sort, this.state.winners.order).then(
                        (response) => {
                            return response;
                        }
                    ),
                    render.pagination(),
                    render.author(),
                ];
                break;
        }

        const body = getHTMLElement(document.querySelector('body'));
        body.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        pageComponents.forEach((element) => {
            wrapper.appendChild(element);
        });
        body.appendChild(wrapper);
        this.addEventListeners(page);
    }

    private async createCarRoots(page: number) {
        const roots = document.createElement('div');
        roots.classList.add('car-roots');

        await this.data.getCars(page).then((response) => {
            if (response.count) {
                this.state.garage.size = +response.count;
            }

            roots.innerHTML = `
            <h1>Garage(${this.state.garage.size})</h1>
            <h3>Page #${this.state.garage.page}</h3>`;

            for (let key in response.items) {
                const render = new Render(this.state);
                const car = render.car(response.items[key].color, response.items[key].id);
                const name = response.items[key].name;
                const id = response.items[key].id;
                const carRoot = render.carRoot(car, name, id);
                roots.appendChild(carRoot);
            }
        });
        return roots;
    }

    private async createWinnersTable(sort: Sort, order: Order) {
        let cars = '';
        const query = {
            page: this.state.winners.page,
            limit: 7,
            sort: sort,
            order: order,
        };
        await this.data.getWinners(query).then((response) => {
            this.state.winners.count = +(response.count || '0');
            response.items.forEach((item) => {
                const render = new Render(this.state);
                cars += render.winner(item);
            });
        });
        const template = `
        <h1 class="winners-control-heading">Winners(${this.state.winners.count})</h1>
        <h3 class="winners-control-page">Page #${this.state.winners.page}</h3>
        <table>
            <tr>
              <th>#</th>
              <th>Car</th>
              <th>Name</th>
              <th><button class="wins">Wins</button></th>
              <th><button class="time">Time(s)</button></th>
            </tr>
            ${cars}
        </table>`;
        const winners = document.createElement('div');
        winners.classList.add('winners-control');
        winners.innerHTML = template;
        return winners;
    }

    // for what duplicate it ?
    private async createCar(car: ICarBody) {
        // then(() => {}) what is it
        await this.data.createCar(car).then(() => {});
    }

    private async removeCar(id: string) {
        const query = {
            page: this.state.winners.page,
            limit: 7,
            sort: Sort.id,
            order: Order.ASC,
        };
        await this.data.getWinners(query).then((response) => {
            response.items.forEach((item) => {
                if (item.id == id) {
                    this.data.deleteWinner(id);
                }
            });
        });

        await this.data.deleteCar(id).then((response) => {
            console.log(`Car ${id} removed!`);
            this.state.garage.roots = null;
            this.createPage(Pages.Garage);
        });
    }

    private async startEngine(id: string) {
        let distance = this.state.root - 80;

        const car = getSVGElement(document.querySelector(`[data-svg-id="${id}"]`));
        const buttonStop = getHTMLButtonElement(document.querySelector(`[data-stop="${id}"]`));
        const buttonStart = getHTMLButtonElement(document.querySelector(`[data-start="${id}"]`));
        const ButtonEdit = getHTMLButtonElement(document.querySelector(`[data-edit="${id}"]`));
        const ButtonRemove = getHTMLButtonElement(document.querySelector(`[data-remove="${id}"]`));

        // why let
        const time = await this.data.startEngine(id).then(async (props) => {
            // 'time' - same name as variable in closure - bad practice
            let time = props.distance / props.velocity / 1000;
            buttonStop.disabled = false;
            buttonStart.disabled = true;
            ButtonEdit.disabled = true;
            ButtonRemove.disabled = true;

            let speed = distance / time / 100;

            // console.log('Time: ' + time);
            // console.log('Distance: ' + distance);
            // console.log('Speed: ' + speed * 100);

            function reduceDistance() {
                if (distance > 0) {
                    car.style.right = distance + 'px';
                    distance = distance - speed;
                } else {
                    clearInterval(counter);
                }
            }

            function reduceTurboDistance() {
                if (distance > 0) {
                    car.style.right = distance + 'px';
                    distance = distance - distance / 100;
                } else {
                    clearInterval(counter);
                }
            }

            let reset = { state: false };

            const counter = setInterval(this.state.turbo ? reduceTurboDistance : reduceDistance, 10);
            this.stopIntervalHandler(id, reset, counter);

            await this.data.drive(id).then((response) => {
                if (reset.state == false) {
                    if (response.success == false) {
                        clearInterval(counter);
                        console.log(`Car ${id} was broken!`);
                        const particles = new Particles();
                        particles.create(
                            particles.getOffset(car).x,
                            particles.getOffset(car).y,
                            'Broken!',
                            car.getAttribute('fill') || '#ef3c40'
                        );
                        throw new Error('500');
                    } else {
                        console.log(`Car ${id} finished!`);
                        const flag = getSVGElement(document.querySelector(`[data-flag="${id}"]`));
                        const particles = new Particles();
                        particles.create(
                            particles.getOffset(flag).x,
                            particles.getOffset(flag).y,
                            'Finished!',
                            car.getAttribute('fill') || '#000'
                        );
                        clearInterval(counter);
                    }
                } else {
                    throw new Error('You stopped the car!');
                }
            });
            return +`${time.toFixed(2)}`;
        });
        return { id, time };
    }

    private async stopEngine(id: string) {
        return await this.data.stopEngine(id).then(() => {
            const car = getSVGElement(document.querySelector(`[data-svg-id="${id}"]`));
            const buttonStop = getHTMLButtonElement(document.querySelector(`[data-stop="${id}"]`));
            const buttonStart = getHTMLButtonElement(document.querySelector(`[data-start="${id}"]`));
            const ButtonEdit = getHTMLButtonElement(document.querySelector(`[data-edit="${id}"]`));
            const ButtonRemove = getHTMLButtonElement(document.querySelector(`[data-remove="${id}"]`));
            car.style.right = '';
            car.style.backgroundColor = '';
            buttonStop.disabled = true;
            buttonStart.disabled = false;
            ButtonRemove.disabled = false;
            ButtonEdit.disabled = false;
        });
    }

    private async resolveWinner(
        racers: Array<
            Promise<{
                id: string;
                time: number;
            }>
        >
    ) {
        const winner = await Promise.any(racers);
        const car = await this.data.getCar(winner.id);
        const element = getHTMLElement(document.querySelector('.car-roots'));
        await this.data.saveWinner({ id: winner.id, time: winner.time });
        const render = new Render(this.state);
        element.prepend(render.winnerBoard(car.name, winner.time));
    }

    //Handlers

    private createCarHandler() {
        const input = getHTMLInputElement(document.querySelector('#create-input'));
        const color = getHTMLInputElement(document.querySelector('#create-color'));
        const button = getHTMLElement(document.querySelector('#create-button'));

        input.addEventListener('change', () => {
            this.state.garage.inputs.create = input.value;
        });

        color.addEventListener('change', () => {
            this.state.garage.colors.create = color.value;
        });

        button.addEventListener('click', () => {
            let car: ICarBody = {
                name: input.value || '',
                color: color.value || '#fff',
            };
            this.createCar(car).then(() => {
                this.createPage(Pages.Garage);
            });
        });
    }

    private updateCarHandler() {
        const editButtons = document.querySelectorAll('.car-root-edit');
        const input = getHTMLInputElement(document.querySelector('#update-input'));
        const color = getHTMLInputElement(document.querySelector('#update-color'));
        const updateButton = getHTMLButtonElement(document.querySelector('#update-button'));

        input.addEventListener('change', () => {
            this.state.garage.inputs.update = input.value;
        });

        color.addEventListener('change', () => {
            this.state.garage.colors.update = color.value;
        });

        editButtons.forEach((editButton) => {
            const edit = getHTMLButtonElement(editButton);
            edit.addEventListener('click', () => {
                if (edit.value) {
                    this.data.getCar(edit.value).then((response) => {
                        input.value = response.name;
                        color.value = response.color;
                        input.disabled = false;
                        color.disabled = false;
                        updateButton.disabled = false;
                        updateButton.value = edit.value;
                        this.state.garage.update = '';
                        this.state.garage.inputs.update = input.value;
                        this.state.garage.colors.update = color.value;
                        this.state.garage.updateID = edit.value || '';
                    });
                } else {
                    throw new Error('Wrong id!');
                }
            });
        });

        updateButton.addEventListener('click', () => {
            let car: ICarBody = {
                name: input.value || '',
                color: color.value || '#fff',
            };

            const id = updateButton.value;

            if (id) {
                this.data.updateCar(id, car).then(() => {
                    this.state.garage.update = 'disabled';
                    this.state.garage.updateID = '';
                    this.state.garage.inputs.update = '';
                    this.state.garage.colors.update = this.state.color;

                    const wrapper = getHTMLElement(document.querySelector(`[data-id="${id}"]`));
                    const render = new Render(this.state);
                    const svg = render.car(car.color, id);
                    wrapper.replaceWith(render.carRoot(svg, car.name, id));

                    console.log(`Car ${id} updated!`);
                });
            } else {
                throw new Error('Wrong id!');
            }
        });
    }

    private removeCarHandler() {
        const removeButtons = document.querySelectorAll('.car-root-remove');

        removeButtons.forEach((removeButton) => {
            const remove = getHTMLButtonElement(removeButton);
            const id = remove.value;

            remove.addEventListener('click', async () => {
                if (id) {
                    await this.removeCar(id);
                } else {
                    throw new Error('Wrong id!');
                }
            });
        });
    }

    private garagePageHandler() {
        const garage = getHTMLElement(document.querySelector('.garage'));
        garage.addEventListener('click', () => {
            this.createPage(Pages.Garage);
        });
    }

    private winnersPageHandler() {
        const winners = getHTMLElement(document.querySelector('.winners'));
        winners.addEventListener('click', () => {
            const roots = document.querySelector('.car-roots');
            if (roots) {
                const carRoots = getHTMLElement(document.querySelector('.car-roots'));
                this.state.garage.roots = carRoots;
            }
            this.createPage(Pages.Winners);
        });
    }

    private menuHandler() {
        this.winnersPageHandler();
        this.garagePageHandler();
    }

    private paginationHandler(page: Pages) {
        const prev = getHTMLButtonElement(document.querySelector('.prev'));
        const next = getHTMLButtonElement(document.querySelector('.next'));

        switch (page) {
            case 1:
                const maxPage = Math.ceil(this.state.garage.size / 7);

                if (this.state.garage.page < 2) {
                    prev.disabled = true;
                }

                if (this.state.garage.page === maxPage || this.state.garage.size < 8) {
                    next.disabled = true;
                }

                prev.addEventListener('click', () => {
                    if (this.state.garage.page > 1) {
                        this.state.garage.page = this.state.garage.page - 1;
                        this.state.garage.roots = null;
                        this.createPage(Pages.Garage);
                    }
                });
                next.addEventListener('click', () => {
                    if (maxPage > this.state.garage.page) {
                        this.state.garage.page = this.state.garage.page + 1;
                        this.state.garage.roots = null;
                        this.createPage(Pages.Garage);
                    }
                });
                break;
            case 2:
                const maxWinnersPage = Math.ceil(this.state.winners.count / 7);

                if (this.state.winners.page < 2) {
                    prev.disabled = true;
                }

                if (this.state.winners.page === maxWinnersPage || this.state.garage.size < 8) {
                    next.disabled = true;
                }

                prev.addEventListener('click', () => {
                    if (this.state.winners.page > 1) {
                        this.state.winners.page = this.state.winners.page - 1;
                        this.state.garage.roots = null;
                        this.createPage(Pages.Winners);
                    }
                });
                next.addEventListener('click', () => {
                    if (maxWinnersPage > this.state.winners.page) {
                        this.state.winners.page = this.state.winners.page + 1;
                        this.state.garage.roots = null;
                        this.createPage(Pages.Winners);
                    }
                });
                break;
        }
    }

    private generateHundredHandler() {
        const hundredButton = getHTMLButtonElement(document.querySelector('.generate-hundred'));
        const random = new Random();

        hundredButton.addEventListener('click', () => {
            const promises = [];

            for (let i = 0; i < 100; i++) {
                const promise = this.createCar(random.getCar()).then(() => {});
                promises.push(promise);
            }

            // Promise.all nice ;)
            Promise.all(promises).then(() => {
                this.state.garage.roots = null;
                this.createPage(Pages.Garage);
            });
        });
    }

    private rootSizeHandler() {
        const carRootElement = document.querySelector('.car-root');
        if (carRootElement) {
            const carRoot = getHTMLElement(carRootElement);
            this.state.root = carRoot.offsetWidth - 23;
            addEventListener('resize', () => {
                this.state.root = carRoot.offsetWidth - 23;
            });
        }
    }

    private stopEngineHandler() {
        const stopButtons = document.querySelectorAll('.car-root-b');

        stopButtons.forEach((stopButton) => {
            const stop = getHTMLButtonElement(stopButton);
            const id = stop.value;

            stop.addEventListener('click', async () => {
                if (id) {
                    this.stopEngine(id);
                } else {
                    throw new Error('Wrong id!');
                }
            });
        });
    }

    private stopIntervalHandler(id: string, reset: { state: Boolean }, interval: NodeJS.Timer) {
        const buttonStop = getHTMLButtonElement(document.querySelector(`[data-stop="${id}"]`));
        const resetButton = getHTMLButtonElement(document.querySelector('.reset'));
        buttonStop.addEventListener('click', () => {
            reset.state = true;
            clearInterval(interval);
        });
        resetButton.addEventListener('click', () => {
            reset.state = true;
            clearInterval(interval);
        });
    }

    private async raceHandler() {
        const raceButton = getHTMLButtonElement(document.querySelector('.race'));

        raceButton.addEventListener('click', () => {
            const cars = document.querySelectorAll('.car-root-a');
            const winnerBoard = document.querySelector('.winner-board');
            const racers: Promise<{
                id: string;
                time: number;
            }>[] = [];

            if (winnerBoard) {
                winnerBoard.remove();
            }

            cars.forEach((carData) => {
                const car = getHTMLButtonElement(carData);
                const id = car.value;
                racers.push(this.startEngine(id));
            });
            this.resolveWinner(racers);
        });
    }

    private async resetHandler() {
        const resetButton = getHTMLButtonElement(document.querySelector('.reset'));

        resetButton.addEventListener('click', () => {
            const cars = document.querySelectorAll('.car-root-b');
            const racers: Promise<void>[] = [];

            cars.forEach((carData) => {
                const car = getHTMLButtonElement(carData);
                const id = car.value;
                racers.push(this.stopEngine(id));
            });
            Promise.all(racers);
        });
    }

    private sortWinnersHandler() {
        const winsSortButton = getHTMLButtonElement(document.querySelector('.wins'));

        winsSortButton.addEventListener('click', () => {
            this.state.winners.sort = Sort.wins;
            if (this.state.winners.order == Order.ASC) {
                this.state.winners.order = Order.DESC;
            } else {
                this.state.winners.order = Order.ASC;
            }
            this.createPage(Pages.Winners);
        });
    }

    private orderWinnersHandler() {
        const timeSortButton = getHTMLButtonElement(document.querySelector('.time'));

        timeSortButton.addEventListener('click', () => {
            this.state.winners.sort = Sort.time;
            if (this.state.winners.order == Order.ASC) {
                this.state.winners.order = Order.DESC;
            } else {
                this.state.winners.order = Order.ASC;
            }
            this.createPage(Pages.Winners);
        });
    }

    private startEngineHandler() {
        const startButtons = document.querySelectorAll('.car-root-a');

        startButtons.forEach((startButton) => {
            const start = getHTMLButtonElement(startButton);
            const id = start.value;

            start.addEventListener('click', async () => {
                if (id) {
                    this.startEngine(id);
                } else {
                    throw new Error('Wrong id!');
                }
            });
        });
    }

    private addEventListeners(page: Pages) {
        if (page === 1) {
            this.createCarHandler();
            this.updateCarHandler();
            this.removeCarHandler();
            this.generateHundredHandler();
            this.startEngineHandler();
            this.stopEngineHandler();
            this.rootSizeHandler();
            this.raceHandler();
            this.resetHandler();
        } else if (page === 2) {
            this.sortWinnersHandler();
            this.orderWinnersHandler();
        }

        this.menuHandler();
        this.paginationHandler(page);
    }
}
