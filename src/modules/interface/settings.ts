export default interface Settings {
    roots: {
        products: {
            data: string;
            assets: {
                images: string;
                videos: string;
            };
        };
    };
    language: {
        default: string;
    };
    currency: {
        default: string;
    };
}
