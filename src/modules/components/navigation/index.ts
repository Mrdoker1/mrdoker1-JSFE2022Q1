import './style.scss';
import Component from '../component';
import template from './index.html';

export default class NavigationComponent extends Component {
    constructor(temp: string = template) {
        super(temp);
        this.marker = 'navigation';
        this.node = super.getNode();
    }
}
