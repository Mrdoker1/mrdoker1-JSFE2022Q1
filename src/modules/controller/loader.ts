export default class Loader {
    callbacks: Array<Function>;
    constructor(...callbacks: Array<Function>) {
        this.callbacks = callbacks;
    }
    errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404) {
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
                throw Error(res.statusText);
            }
        }
        return res;
    }
}
