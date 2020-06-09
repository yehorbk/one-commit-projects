'use strict';

const information = { // length fields contains numbers in range 1..3
    movings: {
        length: 2,
        weight: 0.1,
    },
    food: {
        length: 3,
        weight: 0.4,
    },
    packTime: {
        length: 1,
        weight: 0.5,
    },
};

const statistics = [
    {
        title: 'Good',
        value: 0.04,
    },
    {
        title: 'Middle',
        value: 0.1,
    },
    {
        title: 'Bad',
        value: 0.26,
    },
];

const sigmoid = x => {
    return 1/(1 + Math.pow(Math.E, x));
};

const getHin = input => {
    let result = 0;
    for (const key in input) {
        const value = input[key];
        result += (value.length * value.weight);
    }
    return result;
}

const getMood = (statistics, Hout) => {
    const result = [];
    for (const item of statistics) {
        const title = item.title;
        let percent = Hout * 100 / item.value;
        percent *= percent > 100 ? -1 : 1;
        result.push({ title, percent });
    }
    //result.sort((a, b) => ((b.percent - 100) - (a.percent - 100)));
    return result;
}

const printResult = (Hout, result) => {
    console.log(`Recieved Hout: ${Hout}`);
    console.log('Statistics result:');
    console.log(result);
} 

(() => {
    const Hin = getHin(information);
    const Hout = sigmoid(Hin);
    const result = getMood(statistics, Hout);
    printResult(Hout, result);
})();

/*
const value1 = {length: movings[movings.selectedIndex].value, weight: 0.1};
    const value2 = {length: food[food.selectedIndex].value, weight: 0.4};
    const value3 = {length: packTime[packTime.selectedIndex].value, weight: 0.7};
 var Hin = (value1.length * value1.weight) + (value2.length * value2.weight) +
    (value3.length * value3.weight);

10 - 100
5

    var mood = "";
    if(Hout > 0.4) {
        mood = "Good";
    } else if (Hout > 0.3 && Hout < 0.4) {
        mood = "Middle";
    } else if (Hout < 0.3) {
        mood = "Bad";
    }

    50
    130
    100

    130 - 100 = 30
    50 - 100 = -50

*/
