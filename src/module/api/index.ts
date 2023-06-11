//Interface
import ICar from '../../interface/ICar';
import ICarBody from '../../interface/ICarBody';
import IWinner from '../../interface/IWinner';
import IWinnerBody from '../../interface/IWinnerBody';
import IWinnerItem from '../../interface/IWinnerItem';

//Enums
import { Sort, Order } from '../enums';

const handleError = <E>(error: E) => {
    // at least log it
    console.error(error);
};

export default class Data {
    garage: string;
    engine: string;
    winners: string;

    constructor(base: string) {
        this.garage = `${base}/garage`;
        this.engine = `${base}/engine`;
        this.winners = `${base}/winners`;
    }

    // use everyday types `Record`
    // catch async errors
    getCars = async (page: number, limit = 7): Promise<{ items: Record<string, ICar>; count: string | null }> => {
        const response = await fetch(`${this.garage}?_page=${page}&_limit=${limit}`);
        return {
            items: await response.json(),
            count: response.headers.get('X-Total-Count'),
        };
    };

    // better readability
    getCar = async (id: string): Promise<ICar> => {
        const response = await fetch(`${this.garage}/${id}`).catch(handleError);

        return response?.json();
    };

    // same as getCar
    // return Promise<any>
    createCar = async (body: ICarBody) =>
        (
            await fetch(this.garage, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).json();

    // same as getCar
    deleteCar = async (id: string) =>
        (await fetch(`${this.garage}/${id}`, { method: 'DELETE' }).catch(handleError))?.json();

    // same as getCar
    updateCar = async (id: string, body: ICarBody) =>
        (
            await fetch(`${this.garage}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch(handleError)
        )?.json();

    // same as getCar
    startEngine = async (id: string): Promise<{ velocity: number; distance: number }> =>
        (
            await fetch(`${this.engine}?id=${id}&status=started`, {
                method: 'PATCH',
            }).catch(handleError)
        )?.json();

    stopEngine = async (id: string): Promise<{ velocity: number; distance: number }> =>
        (
            await fetch(`${this.engine}?id=${id}&status=stopped`, {
                method: 'PATCH',
            }).catch(handleError)
        )?.json();

    drive = async (id: string): Promise<{ success: Boolean }> => {
        const res = await fetch(`${this.engine}?id=${id}&status=drive`, {
            method: 'PATCH',
        }).catch(handleError);

        if (!res || res.status !== 200) {
            return { success: false };
        }

        return res.json();
    };

    getSortOrder = (sort: string, order: string) => {
        if (sort && order) return `&_sort=${sort}&_order=${order}`;
        return '';
    };

    getWinners = async ({
        page,
        limit = 10,
        sort,
        order,
    }: {
        page: number;
        limit: number;
        sort: Sort;
        order: Order;
    }): Promise<{ items: Array<IWinnerItem>; count: string | null }> => {
        const response = await fetch(`${this.winners}?_page=${page}&_limit=${limit}${this.getSortOrder(sort, order)}`);
        const items = await response.json();

        return {
            items: await Promise.all(
                items.map(async (winner: IWinner) => ({ ...winner, car: await this.getCar(winner.id) }))
            ),
            count: response.headers.get('X-Total-Count'),
        };
    };

    getWinner = async (id: string) => (await fetch(`${this.winners}/${id}`)).json();

    getWinnerStatus = async (id: string) => (await fetch(`${this.winners}/${id}`)).status;

    deleteWinner = async (id: string) => (await fetch(`${this.winners}/${id}`, { method: 'DELETE' })).json();

    createWinner = async (body: IWinner) =>
        (
            await fetch(this.winners, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).json();

    updateWinner = async (id: string, body: IWinnerBody) =>
        (
            await fetch(`${this.winners}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).json();

    saveWinner = async ({ id, time }: { id: string; time: number }) => {
        const winnerStatus = await this.getWinnerStatus(id);
        if (winnerStatus === 404) {
            await this.createWinner({
                id,
                wins: 1,
                time,
            });
        } else {
            const winner = await this.getWinner(id);
            await this.updateWinner(id, {
                wins: winner.wins + 1,
                time: time < winner.time ? time : winner.time,
            });
        }
    };
}
