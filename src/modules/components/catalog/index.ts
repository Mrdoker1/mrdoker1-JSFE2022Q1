import './style.scss';
import Component from '../component';
import template from './index.html';
import emptyTemplate from './empty.html';
import getHTMLElement from '../../../utils/getHTMLElement';
import translate from '../translation';

export default class CatalogComponent extends Component {
    productsCount: number;
    maxProductOnPage: number;
    defaultLanguage: string;
    constructor(temp: string = template, productsCount: number, maxProductOnPage: number = 9, defaultLanguage: string) {
        super(temp);
        this.marker = 'catalog';
        this.productsCount = productsCount;
        this.maxProductOnPage = maxProductOnPage;
        this.defaultLanguage = defaultLanguage;
        this.node = super.getNode();
    }
    getNode(): Node {
        let node = super.getNode();
        let button = getHTMLElement(getHTMLElement(node).getElementsByClassName('show-more')[0]);
        let catalog = getHTMLElement(getHTMLElement(node).getElementsByClassName('catalog-wrapper')[0]);

        document.addEventListener('pageTranslated', (e: CustomEventInit) => {
            let button = document.querySelector('.show-more')!;
            if (this.productsCount && button) {
                if (this.productsCount < this.maxProductOnPage) {
                    button.classList.add('hide');
                } else {
                    button.classList.remove('hide');
                    button.textContent = `${translate[e.detail.language]['showMoreButton']} (${
                        this.productsCount - this.maxProductOnPage
                    })`;
                }
            }
        });

        document.addEventListener('componentUpdated', (e: CustomEventInit) => {
            let button = document.querySelector('.show-more')!;

            if (button) {
                if (this.productsCount) {
                    if (this.productsCount < this.maxProductOnPage) {
                        button.classList.add('hide');
                    } else {
                        button.classList.remove('hide');
                        button.textContent = `${translate[e.detail.language]['showMoreButton']} (${
                            this.productsCount - this.maxProductOnPage
                        })`;
                    }
                }
            }
        });

        button.addEventListener('click', () => {
            let button = document.querySelector('.show-more')!;
            let language = window.localStorage.getItem('language');

            if (catalog.classList.contains('hide-content')) {
                catalog.classList.remove('hide-content');
                catalog.classList.add('show-content');
                if (language) {
                    button.textContent = `${translate[language]['hideCatalogItemButton']}`;
                } else {
                    button.textContent = `${translate[this.defaultLanguage]['hideCatalogItemButton']}`;
                }
            } else {
                catalog.classList.remove('show-content');
                catalog.classList.add('hide-content');
                if (language) {
                    button.textContent = `${translate[language]['showMoreButton']} (${
                        this.productsCount - this.maxProductOnPage
                    })`;
                } else {
                    button.textContent = `${translate[this.defaultLanguage]['showMoreButton']} (${
                        this.productsCount - this.maxProductOnPage
                    })`;
                }
            }
        });
        return node;
    }
    getEmptyTemplateNode(): Node {
        return super.getNode(emptyTemplate);
    }
}
