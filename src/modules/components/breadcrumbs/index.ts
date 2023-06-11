import './style.scss';
import Component from '../component';
import template from './index.html';

export default class BreadcrumbsComponent extends Component {
    constructor(temp: string = template) {
        super(temp);
        this.marker = 'breadcrumbs';
        this.node = super.getNode();
    }
}
