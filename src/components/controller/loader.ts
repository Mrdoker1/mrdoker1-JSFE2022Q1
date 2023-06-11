import DataSources from '../interfaces/dataSources';

class Loader {
    baseLink: string;
    options: object;
    constructor(baseLink: string, options: object) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        { endpoint, options = {} }: { endpoint: string; options?: object },
        callback = () => {
            console.error('No callback for GET response');
        }
    ) {
        this.load('GET', endpoint, callback, options);
    }

    errorHandler(res: Response) {
        const errNode: Element = document.querySelector('.news')!;
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                errNode.innerHTML = `Sorry, but there is ${res.status} error: ${res.statusText}`;
            console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl(options: {}, endpoint: string) {
        const urlOptions: { [key: string]: string } = {
            ...this.options,
            ...options,
        };

        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            let hash: string = urlOptions[key];
            url += `${key}=${hash}&`;
        });

        return url.slice(0, -1);
    }

    load(method: string, endpoint: string, callback: (data?: DataSources) => void, options = {}) {
        fetch(this.makeUrl(options, endpoint), {
            method,
        })
            .then(this.errorHandler)
            .then((res: Response) => res.json())
            .then((data: DataSources) => callback(data))
            .catch((err: Error) => {
                console.error(err);
            });
    }
}

export default Loader;
