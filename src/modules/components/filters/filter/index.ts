import './style.scss';

import materialTemplate from './material.html';
import genderTemplate from './gender.html';
import stockTemplate from './stock.html';
import typeTemplate from './type.html';

import Component from '../../component';
import SettingLoader from '../../../controller/settingLoader';
import Settings from '../../../interface/settings';
import ProductList from '../../../interface/productList';
import ComponentBuilder from '../../../view/componentBuilder';
import getHTMLElement from '../../../../utils/getHTMLElement';
import getSelectElement from '../../../../utils/getHTMLSelectElement';

export default class FilterComponent extends Component {
    constructor(temp: string = materialTemplate, type?: string) {
        super(temp);
        this.marker = 'filter';
        switch (type) {
            case 'material':
                this.marker = `${type}-${this.marker}`;
                this.template = materialTemplate;
                break;
            case 'gender':
                this.marker = `${type}-${this.marker}`;
                this.template = genderTemplate;
                break;
            case 'stock':
                this.marker = `${type}-${this.marker}`;
                this.template = stockTemplate;
                break;
            case 'type':
                this.marker = `${type}-${this.marker}`;
                this.template = typeTemplate;
                break;
        }
        this.node = this.getNode();
    }
    getNode(): Node {
        let node = super.getNode();
        let component = getSelectElement(getHTMLElement(node).getElementsByClassName('filter-key')[0]);

        component.addEventListener('change', () => {
            let clearButton = document.querySelector('.clear-filter')!;
            let catalog = getHTMLElement(document.querySelector('.catalog'));
            clearButton.classList.remove('disable');

            switch (component.id) {
                case 'materialFilter':
                    this.updateComponent(catalog, 'catalog', component.id, component.value);
                    break;
                case 'genderFilter':
                    this.updateComponent(catalog, 'catalog', component.id, component.value);
                    break;
                case 'stockFilter':
                    this.updateComponent(catalog, 'catalog', component.id, component.value);
                    break;
                case 'typeFilter':
                    this.updateComponent(catalog, 'catalog', component.id, component.value);
                    break;
            }
        });
        return node;
    }

    updateComponent(node: HTMLElement, component: string, ...args: Array<string>) {
        let callback = (settings: Settings, productList: ProductList, language: string) => {
            for (const key in productList) {
                if (args[0] == 'materialFilter') {
                    switch (args[1]) {
                        case '1':
                            if (productList[key].props.material != 'silver') {
                                delete productList[key];
                            }
                            break;
                        case '2':
                            if (productList[key].props.material != 'gold') {
                                delete productList[key];
                            }
                            break;
                        case '3':
                            if (productList[key].props.material != 'steel') {
                                delete productList[key];
                            }
                    }
                }
                if (args[0] == 'genderFilter') {
                    switch (args[1]) {
                        case '1':
                            if (productList[key].props.gender != 'man') {
                                delete productList[key];
                            }
                            break;
                        case '2':
                            if (productList[key].props.gender != 'woman') {
                                delete productList[key];
                            }
                            break;
                    }
                }
                if (args[0] == 'stockFilter') {
                    if (productList[key].stock > 0 && args[1] == '2') {
                        delete productList[key];
                    } else if (productList[key].stock >= 0 && args[1] == '1') {
                        delete productList[key];
                    } else if (productList[key].stock <= 0 && args[1] == '0') {
                        delete productList[key];
                    }
                }
                if (args[0] == 'typeFilter') {
                    switch (args[1]) {
                        case '1':
                            if (productList[key].props.type != 'barrette') {
                                delete productList[key];
                            }
                            break;
                        case '2':
                            if (productList[key].props.type != 'ring') {
                                delete productList[key];
                            }
                            break;
                        case '3':
                            if (productList[key].props.type != 'earring') {
                                delete productList[key];
                            }
                            break;
                        case '4':
                            if (productList[key].props.type != 'brooch') {
                                delete productList[key];
                            }
                            break;
                    }
                }
            }
            let builder = new ComponentBuilder(productList, settings);
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
