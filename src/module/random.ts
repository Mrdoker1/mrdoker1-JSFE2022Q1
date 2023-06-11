import ICarBody from '../interface/ICarBody';

// extract constants from classes and functions, less memory used
const brand = [
    'Abarth',
    'Alfa Romeo',
    'Aston Martin',
    'Audi',
    'Bentley',
    'BMW',
    'Bugatti',
    'Cadillac',
    'Chevrolet',
    'Chrysler',
    'Citroën',
    'Dacia',
    'Daewoo',
    'Daihatsu',
    'Dodge',
    'Donkervoort',
    'DS',
    'Ferrari',
    'Fiat',
    'Fisker',
    'Ford',
    'Honda',
    'Hummer',
    'Hyundai',
    'Infiniti',
    'Iveco',
    'Jaguar',
    'Jeep',
    'Kia',
    'KTM',
    'Lada',
    'Lamborghini',
    'Lancia',
    'Land Rover',
    'Landwind',
    'Lexus',
    'Lotus',
    'Maserati',
    'Maybach',
    'Mazda',
    'McLaren',
    'Mercedes-Benz',
    'MG',
    'Mini',
    'Mitsubishi',
    'Morgan',
    'Nissan',
    'Opel',
    'Peugeot',
    'Porsche',
    'Renault',
    'Rolls-Royce',
    'Rover',
    'Saab',
    'Seat',
    'Skoda',
    'Smart',
    'SsangYong',
    'Subaru',
    'Suzuki',
    'Tesla',
    'Toyota',
    'Volkswagen',
    'Volvo',
];

const model = [
    'Aspen',
    'DeVille',
    'Ioniq',
    'Portofino',
    'Suburban',
    'Aspire',
    'Diablo',
    'Jade',
    'Precis',
    'Summit',
    'Astra',
    'Diamante',
    'Javelin',
    'Prefect',
    'Sunbeam',
    'Aurora',
    'Discovery',
    'Jimmy',
    'Previa',
    'Sunfire',
    'Avalanche',
    'Drifter',
    'Juke',
    'Prius',
    'Sunliner',
    'Avalon',
    'Durango',
    'Justy',
    'Prizm',
    'Supra',
    'Avancier',
    'Duster',
    'Probe',
    'Swift',
    'Pronto',
    'Tacoma',
];

export default class Random {
    constructor() {}

    private getColor() {
        // magic numbers
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private getCarName() {
        return brand[this.getRandomInt(0, brand.length)] + ' ' + model[this.getRandomInt(0, model.length)];
    }

    getCar() {
        // why let ?
        let car: ICarBody = {
            name: this.getCarName(),
            color: this.getColor(),
        };
        return car;
    }
}
