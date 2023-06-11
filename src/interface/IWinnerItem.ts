import ICar from './ICar';
import IWinner from './IWinner';

export default interface IWinnerItem extends IWinner {
    car: ICar;
}
