import SettingLoader from '../controller/settingLoader';

export default class App {
    constructor() {}
    start(): void {
        let settings: SettingLoader = new SettingLoader();
        settings.run('data/settings.json');
    }
}
