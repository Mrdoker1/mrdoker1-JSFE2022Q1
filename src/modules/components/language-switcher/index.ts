import './style.scss';
import template from './index.html';
import Component from '../component';
import translate from '../translation';
import getHTMLSelectElement from '../../../utils/getHTMLSelectElement';

export default class LanguageSwitcherComponent extends Component {
    language: string;
    constructor(temp: string = template, lang: string) {
        super(temp);
        this.marker = 'language-switcher';
        this.language = lang;
        this.node = this.getNode();
    }
    getNode(): Node {
        let node = super.getNode();
        let component = (node as HTMLElement).getElementsByClassName('language-key')[0] as HTMLSelectElement;

        document.addEventListener('pageBuilded', () => {
            this.translatePage(this.language);
            switch (this.language) {
                case 'en':
                    component.value = '0';
                    break;
                case 'ru':
                    component.value = '1';
                    break;
                case 'pl':
                    component.value = '2';
                    break;
            }
        });

        component.addEventListener('change', () => {
            console.log(`Language changed - ${component.value}`);

            let switchers = document.querySelectorAll('.language-key')!;

            switchers.forEach((switcher) => {
                if (switcher != component) {
                    getHTMLSelectElement(switcher).value = component.value;
                }
            });

            switch (component.value) {
                case '0':
                    this.setLanguage('en');
                    break;
                case '1':
                    this.setLanguage('ru');
                    break;
                case '2':
                    this.setLanguage('pl');
                    break;
            }
        });
        return node;
    }
    set() {
        const switcher: HTMLInputElement = document.querySelector('.language-key')!;
        switcher.addEventListener('change', () => {
            switch (switcher.value) {
                case '0':
                    this.setLanguage('en');
                    break;
                case '1':
                    this.setLanguage('ru');
                    break;
                case '2':
                    this.setLanguage('pl');
                    break;
            }
        });
    }
    setLanguage(language: string) {
        window.localStorage.setItem('language', language);
        let catalog: HTMLElement = document.querySelector('.catalog')!;
        this.updateComponent(catalog, 'catalog');
        this.translatePage(language);
    }
    translatePage(language: string) {
        document.querySelectorAll('[data-i18]').forEach((element) => {
            let data: string = (element as HTMLElement).dataset.i18!;

            if (element instanceof HTMLInputElement) {
                element.placeholder = translate[language][data];
            } else {
                element.textContent = translate[language][data];
            }
        });

        const event = new CustomEvent('pageTranslated', {
            detail: {
                language: `${language}`,
            },
        });

        document.dispatchEvent(event);
    }
}
