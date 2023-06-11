export { generateArrayRandomNumber, generateRandom }


function generateArrayRandomNumber(min, max) {

    var totalNumbers = max - min + 1,
        arrayTotalNumbers = [],
        arrayRandomNumbers = [],
        tempRandomNumber;
    while (totalNumbers--) {
        arrayTotalNumbers.push(totalNumbers + min);
    }
    while (arrayTotalNumbers.length) {
        tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
        arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
        arrayTotalNumbers.splice(tempRandomNumber, 1);

    }
    return arrayRandomNumbers;
}

function generateRandom(min, max, exclude) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;

    for (let i = 0; i < exclude.length; i++) {
        if (num == exclude[i]) {
            return generateRandom(min, max, exclude)
        }
    }
    return num;
}