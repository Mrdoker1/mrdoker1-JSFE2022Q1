import App from './module/app';
// from minuses - catch async errors, it should not break work of whole app
// for example - try to stop back, make some async action and start back again - your app will be crashed

// svg in class methods that initialized a lot of time - bad

// do not pass some big state for methods/functions that do not need it wholly

// at whole good job
const application: App = new App('http://127.0.0.1:3000');
application.start();
