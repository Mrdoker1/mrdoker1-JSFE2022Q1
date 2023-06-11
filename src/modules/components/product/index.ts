import './style.scss';
import Component from '../component';
import template from './index.html';
import '../../../assets/img/products/example/1.jpg';
import Product from '../../interface/product';
import Cart from '../../interface/cart';
import Notification from '../../components/notification';
import getElement from '../../../utils/getElement';
import getHTMLImageElement from '../../../utils/getHTMLImageElement';

export default class ProductComponent extends Component {
    marker: string;
    constructor(temp: string = template, productData: Product, currency: string, assetsRoot: string) {
        super(temp);
        this.marker = 'product';
        this.template = `<div class="product">
            <img class="product-image">
            <div class="product-wrapper">
                <div class="product-name">${productData.name}</div>
                <div class="product-info">${productData.props.info}</div>
                <div class="product-price">${currency}${productData.price}</div>
            </div>
        </div>`;
        this.node = this.getProductNode(assetsRoot, productData);
    }
    getProductNode(assetsRoot: string, productData: Product): Node {
        let node = super.getNode();
        let component = getHTMLImageElement(getElement(node).getElementsByClassName('product-image')[0]);
        component.src = `${assetsRoot}${productData.props.id}/main.jpg`;

        document.addEventListener('pageBuilded', () => {
            let cart: Cart = this.getCartInfo();
            this.updateView(productData, component, cart);
        });

        document.addEventListener('componentUpdated', () => {
            let cart: Cart = this.getCartInfo();
            this.updateView(productData, component, cart);
        });

        node.addEventListener('click', (e) => {
            let cart: Cart = this.getCartInfo();

            if (cart.products.length >= 20 && cart.products.indexOf(productData.props.id) == -1) {
                let notification = new Notification(undefined, 'popup', "You can't add more than 20 products in cart");
                notification.show();
            } else {
                if (cart.products.indexOf(productData.props.id) == -1) {
                    console.log(`Product ${productData.props.id} added to Shopping cart!`);
                    cart.products.push(productData.props.id);
                    window.localStorage.setItem('cart', JSON.stringify(cart));
                } else {
                    console.log(`Product ${productData.props.id} removed from Shopping cart!`);
                    cart.products.splice(cart.products.indexOf(productData.props.id), 1);
                    window.localStorage.setItem('cart', JSON.stringify(cart));
                }
                this.updateView(productData, component, cart);
            }
        });

        return node;
    }
    updateView(productData: Product, component: HTMLElement, cart: Cart) {
        let productCounter: HTMLElement = document.querySelector('.product-counter')!;

        if (cart.products.indexOf(productData.props.id) == -1) {
            productCounter.textContent = `${cart.products.length}`;
            component.style.borderRadius = ``;
            component.style.webkitFilter = ``;
        } else {
            productCounter.textContent = `${cart.products.length}`;
            component.style.borderRadius = `200px 200px 200px 200px`;
            component.style.webkitFilter = `grayscale(100%)`;
        }

        if (cart.products.length <= 0) {
            productCounter.classList.add('hide');
        } else {
            productCounter.classList.remove('hide');
        }
    }

    getCartInfo(): Cart {
        let cart: Cart = { summary: 0, products: [] };

        if (window.localStorage.getItem('cart')) {
            cart = JSON.parse(window.localStorage.getItem('cart')!);
        } else {
            window.localStorage.setItem('cart', JSON.stringify(cart));
        }

        return cart;
    }
}
