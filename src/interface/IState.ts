//Enums
import { Sort, Order } from '../module/enums';

export default interface IState {
    turbo: Boolean;
    color: string;
    root: number;
    winners: {
        page: number;
        count: number;
        sort: Sort;
        order: Order;
    };
    garage: {
        roots: HTMLElement | null;
        page: number;
        size: number;
        inputs: {
            create: string;
            update: string;
        };
        colors: {
            create: string;
            update: string;
        };
        update: string;
        updateID: string;
    };
}
