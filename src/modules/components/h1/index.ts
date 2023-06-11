import './style.scss';
import Component from '../component';
import template from './index.html';
import getElement from '../../../utils/getElement';

export default class H1Component extends Component {
    name: string;
    constructor(temp: string = template, name: string = 'Example') {
        super(temp);
        this.marker = 'h1';
        this.name = name;
        if (name && name.length != 0) {
            this.changeName(name);
        }
        this.node = super.getNode();
    }
    changeName(name: string) {
        this.template = this.template.replaceAll(`Heading Example<\/h1>`, `${name}<\/h1>`);

        ///(?<=\>).*?(?=\<\/h1>)/g
    }
}
