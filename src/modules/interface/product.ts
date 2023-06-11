export default interface Product {
    [key: string]: string | number | {};
    name: string;
    price: number;
    stock: number;
    props: {
        id: number;
        info: string;
        description: string;
        part: string;
        material: string;
        gender: string;
        type: string;
    };
}
