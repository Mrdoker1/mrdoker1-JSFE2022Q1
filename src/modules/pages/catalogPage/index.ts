import './style.scss';
import Component from '../../components/component';
import template from './index.html';

export default class Catalog extends Component {
    constructor(temp: string = template) {
        super(temp);
        this.marker = 'catalog-page';
        this.node = super.getNode();
    }
}
