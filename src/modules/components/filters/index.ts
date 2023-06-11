import './style.scss';
import Component from '../component';
import template from './index.html';
import getHTMLElement from '../../../utils/getHTMLElement';
import * as noUiSlider from 'nouislider';
interface noUiSliderInstance extends HTMLElement {
    noUiSlider: noUiSlider.API;
}

export default class FiltersComponent extends Component {
    constructor(temp: string = template) {
        super(temp);
        this.marker = 'filters';
        this.node = this.getNode();
    }
    getNode(): Node {
        let node = super.getNode();
        let clearButton = getHTMLElement(node).getElementsByClassName('clear-filter')[0];
        let filters = getHTMLElement(node).getElementsByClassName('filter-key') as unknown as Array<HTMLSelectElement>;

        document.addEventListener('pageBuilded', () => {
            for (let filter of filters) {
                if (filter.selectedIndex != 0) {
                    clearButton.classList.remove('disable');
                } else {
                    clearButton.classList.add('disable');
                }
            }
        });

        clearButton.addEventListener('click', () => {
            clearButton.classList.add('disable');
            for (let filter of filters) {
                filter.selectedIndex = 0;
            }
            let catalog: HTMLElement = document.querySelector('.catalog')!;
            this.updateComponent(catalog, 'catalog');

            let slider = getHTMLElement(document.querySelector('.price-slider'));
            (slider as noUiSliderInstance).noUiSlider.reset();
        });
        return node;
    }
}
