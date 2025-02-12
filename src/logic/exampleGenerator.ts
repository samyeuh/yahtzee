function getSelectedImgOfDice(dice: number): string {
    return "/dices/dice" + dice + "_select.png";
}

function getImgOfDice(dice: number): string {
    return "/dices/dice" + dice + ".png";
}

export function generateComplexeExamples(combinations: Record<string, string[]>): Record<string, string[]> {
    combinations["threeOfAKind"] = generateKind(3);
    combinations["fourOfAKind"] = generateKind(4);
    combinations["fullHouse"] = generateFullHouse();
    combinations["smallStraight"] = generateSmallStraight();
    combinations["largeStraight"] = generateLargeStraight();
    combinations["yahtzee"] = generateYahtzee();
    combinations["chance"] = generateChance();
    return combinations;
}

function generateKind(n: number): string[] {
    let imgs: string[] = [];
    let numb = Math.floor(Math.random() * 6) + 1;
    for (let i = 0; i < n; i++) {
        imgs.push(getSelectedImgOfDice(numb));
    }

    for (let i = 0; i < 5 - n; i++) {
        let soloNumb = Math.floor(Math.random() * 6) + 1;
        while (soloNumb === numb) {
            soloNumb = Math.floor(Math.random() * 6) + 1;
        }
        imgs.push(getImgOfDice(soloNumb));
    }

    return imgs;
}

function generateFullHouse(): string[] {
    let imgs: string[] = [];
    let numb1 = Math.floor(Math.random() * 6) + 1;
    let numb2 = Math.floor(Math.random() * 6) + 1;
    while(numb2 === numb1){
        numb2 = Math.floor(Math.random() * 6) + 1;
    }

    for (let i = 0; i < 3; i++) {
        imgs.push(getSelectedImgOfDice(numb1));
    }

    for (let i = 0; i < 2; i++) {
        imgs.push(getSelectedImgOfDice(numb2));
    }

    return imgs;
}

function generateSmallStraight(): string[] {
    let imgs: string[] = [];
    let numb1 = Math.floor(Math.random() * 3) + 1;
    let numb2 = numb1 + 1;
    let numb3 = numb2 + 1;
    let numb4 = numb3 + 1;

    let numbs = [numb1, numb2, numb3, numb4];

    for (let i = 0; i < 4; i++) {
        imgs.push(getSelectedImgOfDice(numbs[i]));
    }

    imgs.push(getImgOfDice(numb2));

    return imgs;
}

function generateLargeStraight(): string[] {
    let imgs: string[] = [];
    
    let numb1 = Math.floor(Math.random() * 1) + 1;
    let numb2 = numb1 + 1;
    let numb3 = numb2 + 1;
    let numb4 = numb3 + 1;
    let numb5 = numb4 + 1;

    let numbs = [numb1, numb2, numb3, numb4, numb5];

    for (let i = 0; i < 5; i++) {
        imgs.push(getSelectedImgOfDice(numbs[i]));
    }

    return imgs;
}


function generateYahtzee(): string[] {
    let imgs: string[] = [];
    let numb = Math.floor(Math.random() * 6) + 1;
    for (let i = 0; i < 5; i++) {
        imgs.push(getSelectedImgOfDice(numb));
    }

    return imgs;
}

function generateChance(): string[] {
    let imgs: string[] = [];
    for (let i = 0; i < 5; i++) {
        let numb = Math.floor(Math.random() * 6) + 1;
        imgs.push(getImgOfDice(numb));
    }

    return imgs;
}
