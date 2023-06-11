import App from './modules/app/app';
import './data/settings.json';
import './data/products.json';
import './global.scss';

const application: App = new App();
application.start();
