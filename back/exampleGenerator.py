from random import randint

def getSelectImgOfDice(nb):
    return f"/dices/dice{nb}_select.png"

def getImgOfDice(nb):
    return f"/dices/dice{nb}.jpg"

def generateComplexeExample(combi):
    combi["threeOfAKind"] = generateThreeOfAKind()
    combi["fourOfAKind"] = generateFourOfAKind()
    combi["fullHouse"] = generateFull()
    combi["smallStraight"] = generateSmallStraight()
    combi["largeStraight"] = generateLargeStraight()
    combi["yahtzee"] = generateYahtzee()
    combi["chance"] = generateChance()
    return combi

def generateThreeOfAKind():
    triplicateNumb = randint(1,6)
    res = [getSelectImgOfDice(triplicateNumb) for i in range(3)]
    lastNumb = triplicateNumb
    for i in range(2):
        numb = randint(1,6)
        while numb == lastNumb:
            numb = randint(1,6)
        res.append(f"/dices/dice{numb}.jpg")
        lastNumb = numb
    return res

def generateFourOfAKind():
    quadrupleNumb = randint(1,6)
    res = [getSelectImgOfDice(quadrupleNumb) for _ in range(4)]
    
    numb = randint(1,6)
    while numb == quadrupleNumb:
        numb = randint(1,6)
    res.append(f"/dices/dice{numb}.jpg")
    return res

def generateFull():
    triplicateNumb = randint(1,6)
    res = [getImgOfDice(triplicateNumb) for _ in range(3)]

    numb = randint(1,6)
    while numb == triplicateNumb:
        numb = randint(1,6)
    res.append(getImgOfDice(numb))
    res.append(getImgOfDice(numb))

    return res

def generateSmallStraight():
    numb = randint(1,3)
    res = [getSelectImgOfDice(numb), getSelectImgOfDice(numb+1), getSelectImgOfDice(numb+2), getSelectImgOfDice(numb+3), getImgOfDice(numb)]
    return res

def generateLargeStraight():
    numb = randint(1,2)
    res = [getSelectImgOfDice(numb), getSelectImgOfDice(numb+1), getSelectImgOfDice(numb+2), getSelectImgOfDice(numb+3), getSelectImgOfDice(numb+4)]
    return res

def generateYahtzee():
    numb = randint(1,6)
    res = [getImgOfDice(numb) for _ in range(5)]
    return res

def generateChance():
    res = [getImgOfDice(randint(1,6)) for _ in range(5)]
    return res

