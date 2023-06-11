import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import Data from '../interfaces/dataArticles';
import DataSources from '../interfaces/dataSources';

class App {
    controller: AppController;
    view: AppView;
    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start(): void {
        const nodes: NodeListOf<Element> = document.querySelectorAll('.sources')!;
        const burger: Element = document.querySelector('.hamburger')!;
        const menu: Element = document.querySelector('.hamburger__list')!;

        this.setBurger(burger, menu);

        nodes.forEach((element) => {
            element.addEventListener('click', (e: Event) => {
                this.controller.getNews(e, (data?: Data) => this.view.drawNews(data!));
                menu.classList.toggle('hide');
                burger.classList.toggle('rotate');
                window.scrollTo(0, 0);
            });
        });
        this.controller.getSources((data?: DataSources) => {
            this.view.drawSources(data!);
        });
    }

    setBurger(burger: Element, menu: Element): void {
        burger.addEventListener('click', () => {
            menu.classList.toggle('hide');
            burger.classList.toggle('rotate');
        });
    }
}

export default App;
