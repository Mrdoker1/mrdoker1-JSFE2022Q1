import template from './index.html';
import Component from '../component';
import './style.scss';
import PageBuilder from '../../view/pageBuilder';
import SettingLoader from '../../controller/settingLoader';
import Settings from '../../interface/settings';
import ProductList from '../../interface/productList';

export default class HeaderComponent extends Component {
    constructor(temp: string = template) {
        super(temp);
        this.marker = 'header';
        this.node = this.getNode();
    }

    getNode(): Node {
        let node = super.getNode();
        let search = (node as HTMLElement).getElementsByClassName('search-icon')[0] as HTMLSelectElement;

        search.addEventListener('click', () => {
            //window.location.href = '';

            let callback = (settings: Settings, productList: ProductList) => {
                document.body.innerHTML = '';
                let builder = new PageBuilder();
                builder.createCatalogPage(productList, settings);
            };

            let settings: SettingLoader = new SettingLoader();
            settings.load('data/settings.json', callback);
        });
        return node;
    }
}
