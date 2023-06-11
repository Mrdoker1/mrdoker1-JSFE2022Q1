import Product from '../interface/product';

export default interface Products {
    [key: string]: { products: { [key: string]: Product } };
}
