import Builder from './builder';
import ComponentBuilder from './componentBuilder';
import CatalogPage from '../pages/catalogPage';
import ProductList from '../interface/productList';
import Settings from '../interface/settings';
import Notification from '../components/notification';
import getHTMLElement from '../../utils/getHTMLElement';
import * as noUiSlider from 'nouislider';
interface noUiSliderInstance extends HTMLElement {
    noUiSlider: noUiSlider.API;
}

export default class PageBuilder extends Builder {
    constructor() {
        super();
    }
    build(component: string, data?: ProductList, settings?: Settings) {
        switch (component) {
            case 'catalog-page':
                return this.createCatalogPage(data!, settings!);
        }
    }
    createCatalogPage(data: ProductList, settings: Settings) {
        let builder = new ComponentBuilder(data, settings);
        let page = new CatalogPage();
        let temp = page.insert(
            undefined,
            builder.build('header')!,
            builder.build('navigation', 'Catalog')!,
            builder.build('filter')!,
            builder.build('catalog')!,
            builder.build('footer')!
        );
        document.querySelector('body')!.appendChild(temp);
        const event = new CustomEvent('pageBuilded', {
            detail: {
                component: `catalog-page`,
            },
        });
        document.dispatchEvent(event);
        let notification = new Notification(undefined, 'top', 'Working in progress');
        notification.show();

        let slider = getHTMLElement(document.querySelector('.price-slider'));
        (slider as noUiSliderInstance).noUiSlider.on('update', () => {
            let value = (slider as noUiSliderInstance).noUiSlider.get() as Array<string>;
            let startRange = getHTMLElement(document.querySelector('.price-filter-start-range'));
            let finishRange = getHTMLElement(document.querySelector('.price-filter-finish-range'));
            startRange.textContent = `${settings.currency.default}${value[0]}`;
            finishRange.textContent = `${settings.currency.default}${value[1]}`;
        });
    }
}
