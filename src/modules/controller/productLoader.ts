import Loader from './loader';
import Settings from '../interface/settings';
import Products from '../interface/products';
import PageBuilder from '../view/pageBuilder';

export default class ProductLoader extends Loader {
    settings: Settings;
    productsURL: string;
    constructor(settings: Settings, ...callbacks: Array<Function>) {
        super(...callbacks);
        this.settings = settings;
        this.productsURL = settings.roots.products.data;
    }
    async run(url: string = this.productsURL) {
        await fetch(url)
            .then(super.errorHandler)
            .then((res: Response) => res.json())
            .then((productData: Products) => {
                let builder = new PageBuilder();
                let language = window.localStorage.getItem('language');
                if (language) {
                    builder.createCatalogPage(productData[language].products, this.settings);
                } else {
                    builder.createCatalogPage(productData[this.settings.language.default].products, this.settings);
                }
            })
            .catch((err: Error) => {
                console.error(err);
            });
    }

    async load(url: string = this.productsURL) {
        await fetch(url)
            .then(super.errorHandler)
            .then((res: Response) => res.json())
            .then((productData: Products) => {
                this.callbacks.forEach((callback) => {
                    let language = window.localStorage.getItem('language');
                    if (language) {
                        callback(this.settings, productData[language].products, language);
                    } else {
                        callback(
                            this.settings,
                            productData[this.settings.language.default].products,
                            this.settings.language.default
                        );
                    }
                });
            })
            .catch((err: Error) => {
                console.error(err);
            });
    }
}
