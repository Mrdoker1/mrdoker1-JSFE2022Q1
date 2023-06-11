import './style.scss';
import Component from '../component';
import template from './index.html';

export default class FooterComponent extends Component {
    constructor(temp: string = template) {
        super(temp);
        this.marker = 'footer';
        this.node = this.getNode();
    }
    getNode(): Node {
        let node = super.getNode();
        let instagram = (node as HTMLElement).getElementsByClassName('instagram')[0];

        instagram.addEventListener('click', () => {
            window.location.href = 'https://www.instagram.com/do.jewelry/';
        });
        return node;
    }
}
