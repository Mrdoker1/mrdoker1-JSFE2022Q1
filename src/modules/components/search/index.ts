import './style.scss';
import Component from '../component';
import template from './index.html';
import SettingLoader from '../../controller/settingLoader';
import Settings from '../../interface/settings';
import ProductList from '../../interface/productList';
import ComponentBuilder from '../../view/componentBuilder';

export default class SearchComponent extends Component {
    constructor(temp: string = template) {
        super(temp);
        this.marker = 'search';
        this.node = this.getNode();
    }
    getNode(): Node {
        let node = super.getNode();
        let search = (node as HTMLElement).getElementsByClassName('search-field')[0] as HTMLInputElement;
        let icon = (node as HTMLElement).getElementsByClassName('search-icon')[0] as HTMLInputElement;

        document.addEventListener('pageBuilded', () => {
            search.focus();
        });

        search.addEventListener('input', (e) => {
            let catalog = document.querySelector('.catalog') as HTMLElement;

            if (search.value !== '') {
                icon.style.background = 'url("./assets/img/close.svg")';
            } else {
                icon.style.background = 'url("./assets/img/search.svg")';
            }

            this.updateComponent(catalog, 'catalog', search.value);
        });

        icon.addEventListener('click', (e) => {
            let catalog = document.querySelector('.catalog') as HTMLElement;

            if (search.value !== '') {
                search.value = '';
                icon.style.background = 'url("./assets/img/search.svg")';
                search.focus();
            } else {
            }

            this.updateComponent(catalog, 'catalog', search.value);
        });

        return node;
    }

    updateComponent(node: HTMLElement, component: string, ...args: Array<string>) {
        let callback = (settings: Settings, productList: ProductList, language: string) => {
            for (const key in productList) {
                let productName = productList[key].name.toLowerCase();
                let productInfo = productList[key].props.info.toLowerCase();

                if (!productName.includes(args[0].toLowerCase()) && !productInfo.includes(args[0].toLowerCase())) {
                    delete productList[key];
                }
            }

            let builder = new ComponentBuilder(productList, settings);
            if (node.parentNode) {
                node.parentNode!.replaceChild(builder.build(component)!, node);
                const event = new CustomEvent('componentUpdated', {
                    detail: {
                        component: `${component}`,
                        language: `${language}`,
                    },
                });
                document.dispatchEvent(event);
            }
        };
        let settings: SettingLoader = new SettingLoader();
        settings.load('data/settings.json', callback);
    }
}
