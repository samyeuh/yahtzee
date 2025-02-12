import { Combinations, Combi } from '../class/Combi';

export function startCheckingScore(dices: number[], combinations: Combinations): Combinations {
    return checkSameNumber(dices, combinations);
}

function checkSameNumber(dice: number[], combinations: Combinations): Combinations {
        combinations.simple.forEach((element: Combi, index: number) => {
            let score = 0;
            if (element.score !== -1) {
                element.score = element.score;
            }
            dice.forEach((dice) => {
                if(dice === index + 1){
                    score += dice;
                }
            });
            element.score = score;
        });
        return checkKind(dice, combinations);
}

function checkKind(dice: number[], combinations: Combinations): Combinations {
    let editThreeOfAKind: boolean = combinations.complexe[0].score === -1;
    let editFourOfAKind: boolean = combinations.complexe[1].score === -1;

    if (editThreeOfAKind) {
        let found = false;
        dice.forEach((val) => {
            if (dice.filter((v) => v === val).length >= 3){
                combinations.complexe[0].score = val * 3;
                found = true;
            }
        });
        if (!found) combinations.complexe[0].score = 0;
    }

    if (editFourOfAKind) {
        let found = false;
        dice.forEach((val) => { 
            if (dice.filter((v) => v === val).length >= 4){
                combinations.complexe[1].score = val * 4;
                found = true;
            }
        });
        if (!found) combinations.complexe[1].score = 0;
    }
        

    return checkFull(dice, combinations);

}

function checkFull(dice: number[], combinations: Combinations): Combinations {
    if (combinations.complexe[2].score !== -1) {
        return checkStraights(dice, combinations);
    }

    const diceCount: Record<number, number> = {};
    dice.forEach(num => diceCount[num] = (diceCount[num] || 0) + 1);

    const values = Object.values(diceCount);
    const hasThreeOfAKind = values.includes(3);
    const hasPair = values.includes(2);

    combinations.complexe[2].score =
            hasThreeOfAKind && hasPair ? 25 : 0;


    return checkStraights(dice, combinations);
}

function checkStraights(dice: number[], combinations: Combinations): Combinations {
    let editSmallStraight: boolean = combinations.complexe[3].score === -1;
    let editLargeStraight: boolean = combinations.complexe[4].score === -1;

    if (editSmallStraight){
        let smallStraight1: number[] = [1,2,3,4];
        let smallStraight2: number[] = [2,3,4,5];
        let smallStraight3: number[] = [3,4,5,6];
        let smallStraightList = [smallStraight1, smallStraight2, smallStraight3];
        let hasSmallStraight = smallStraightList.some(smallStraight => 
            smallStraight.every(nb => dice.includes(nb))
        );
        combinations.complexe[3].score = hasSmallStraight ? 30 : 0;
    } 

    if (editLargeStraight){
        let largeStraight1: number[] = [1,2,3,4,5];
        let largeStraight2: number[] = [2,3,4,5,6];
        let largeStraightList = [largeStraight1, largeStraight2];
        let hasLargeStraight = largeStraightList.some(largeStraight => 
            largeStraight.every(nb => dice.includes(nb))
        );
        combinations.complexe[4].score = hasLargeStraight ? 40 : 0;
    }

    return checkYahtzee(dice, combinations);
}

function checkYahtzee(dice: number[], combinations: Combinations): Combinations {
    if (combinations.complexe[5].score !== -1) {
        return checkChance(dice, combinations);
    }

    dice.some((val) => {
        if (dice.filter((v) => v === val).length === 5){
            combinations.complexe[5].score = 50;
        } else {
            combinations.complexe[5].score = 0;
        }
    });

    return checkChance(dice, combinations);
}

function checkChance(dice: number[], combinations: Combinations): Combinations {
    if (combinations.complexe[6].score !== -1) {
        return combinations;
    }

    combinations.complexe[6].score = dice.reduce((total, num) => total + num, 0);
    
    return combinations;
}


