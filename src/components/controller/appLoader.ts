import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://newsapi.org/v2/', {
            apiKey: 'bc2a6310ce7a4607b4a8dcdfa6abb3d8',
        });
    }
}

export default AppLoader;
