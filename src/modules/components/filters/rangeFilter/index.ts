import './style.scss';
import Component from '../../component';
import template from './index.html';
import emptyTemplate from '../filter/empty.html';
import ComponentBuilder from '../../../view/componentBuilder';
import getHTMLElement from '../../../../utils/getHTMLElement';
import SettingLoader from '../../../controller/settingLoader';
import Settings from '../../../interface/settings';
import ProductList from '../../../interface/productList';
import * as noUiSlider from 'nouislider';
const wNumb = require('wnumb');
import translate from '../../translation';

interface noUiSliderInstance extends HTMLElement {
    noUiSlider: noUiSlider.API;
}

export default class RangeFilterComponent extends Component {
    constructor(temp: string = template) {
        super(temp);
        this.marker = 'price-filter';
        this.node = this.getNode();
    }
    getNode(): Node {
        let node = super.getNode();
        let slider = getHTMLElement(getHTMLElement(node).getElementsByClassName('price-slider')[0]);

        noUiSlider.create(slider, {
            start: [0, 700],
            connect: true,
            range: {
                min: 0,
                max: 1000,
            },
            format: wNumb({
                decimals: 0,
                thousand: '',
            }),
        });

        let label = getHTMLElement(getHTMLElement(node).getElementsByClassName('price-filter-label')[0]);
        let filter = getHTMLElement(getHTMLElement(node).getElementsByClassName('poped')[0]);
        let filterLabel = getHTMLElement(getHTMLElement(node).getElementsByClassName('price-filter-label')[1]);

        document.addEventListener('click', (e) => {
            const withinBoundaries = e.composedPath().includes(node);

            if (!withinBoundaries) {
                label.classList.remove('hide');
                filter.classList.add('hide');
            }
        });

        filterLabel.addEventListener('click', () => {
            label.classList.remove('hide');
            filter.classList.add('hide');
        });

        label.addEventListener('click', () => {
            label.classList.add('hide');
            filter.classList.remove('hide');
        });

        slider.addEventListener('click', () => {
            let value = (slider as noUiSliderInstance).noUiSlider.get() as Array<string>;
            let catalog = getHTMLElement(document.querySelector('.catalog'));
            this.updateComponent(catalog, 'catalog', ...value);
            let clearButton = document.querySelector('.clear-filter')!;
            clearButton.classList.remove('disable');
        });

        return node;
    }

    updateComponent(node: HTMLElement, component: string, ...args: Array<string>) {
        let callback = (settings: Settings, productList: ProductList, language: string) => {
            let builder = new ComponentBuilder(productList, settings);

            for (const key in productList) {
                let price = productList[key].price;
                if (price < parseInt(args[0]) || price > parseInt(args[1])) {
                    delete productList[key];
                }
            }

            node.parentNode!.replaceChild(builder.build(component)!, node);

            const event = new CustomEvent('componentUpdated', {
                detail: {
                    component: `${component}`,
                    language: `${language}`,
                },
            });
            document.dispatchEvent(event);
        };

        let settings: SettingLoader = new SettingLoader();
        settings.load('data/settings.json', callback);
    }
}
