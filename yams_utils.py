def checkSameNumbers(dices, combinations):
    combinations["simple"]["Un"] = 1 * dices.count(1) if combinations["simple"]["Un"] == "/" else combinations["simple"]["Un"]
    combinations["simple"]["Deux"] = 2 * dices.count(2) if combinations["simple"]["Deux"] == "/" else combinations["simple"]["Deux"]
    combinations["simple"]["Trois"] = 3 * dices.count(3) if combinations["simple"]["Trois"] == "/" else combinations["simple"]["Trois"]
    combinations["simple"]["Quatre"] = 4 * dices.count(4) if combinations["simple"]["Quatre"] == "/" else combinations["simple"]["Quatre"]
    combinations["simple"]["Cinq"] = 5 * dices.count(5) if combinations["simple"]["Cinq"] == "/" else combinations["simple"]["Cinq"]
    combinations["simple"]["Six"] = 6 * dices.count(6) if combinations["simple"]["Six"] == "/" else combinations["simple"]["Six"]
    return checkSuite(dices, combinations)
 
def checkSuite(dices, combinations):
    edit_petite_suite = True
    edit_grande_suite = True
    if combinations["complexe"]["Petite Suite"] != "/":
        edit_petite_suite = False
    if combinations["complexe"]["Grande Suite"] != "/":
        edit_grande_suite = False

    if edit_petite_suite:
        petite_suite1 = [i for i in range(1,5)]
        petite_suite2 = [i for i in range(2,6)]
        if all(numb in dices for numb in petite_suite1) or all(numb in dices for numb in petite_suite2):
            combinations["complexe"]["Petite Suite"] = 20
        else:
            combinations["complexe"]["Petite Suite"] = 0
    if edit_grande_suite:
        grande_suite = [i for i in range(1,6)]
        if all(numb in dices for numb in grande_suite):
            combinations["complexe"]["Grande Suite"] = 40
        else:
            combinations["complexe"]["Grande Suite"] = 0
    return checkFull(dices,combinations)

def checkFull(dices, combinations):
    if combinations["complexe"]["Full"] != "/":
        return checkBrelan(dices, combinations)

    most_frequent = max(set(dices), key=dices.count)
    less_frequent = min(set(dices), key=dices.count)
    if dices.count(most_frequent) == 3 and dices.count(less_frequent) == 2:
        combinations["complexe"]["Full"] = 25
    else:
        combinations["complexe"]["Full"] = 0
    return checkBrelan(dices, combinations)

def checkBrelan(dices, combinations):
    if combinations["complexe"]["Brelan"] != "/":
        return checkCarre(dices, combinations)

    most_frequent = max(set(dices), key=dices.count)
    if dices.count(most_frequent) == 3:
        combinations["complexe"]["Brelan"] = most_frequent*3
    else:
        combinations["complexe"]["Brelan"] = 0
    return checkCarre(dices, combinations)

def checkCarre(dices, combinations):
    if combinations["complexe"]["Carré"] != "/":
        checkYams(dices, combinations)
    
    most_frequent = max(set(dices), key=dices.count)
    if dices.count(most_frequent) == 4:
        combinations["complexe"]["Carré"] = most_frequent*3
    else:
        combinations["complexe"]["Carré"] = 0
    return checkYams(dices, combinations)


def checkYams(dices, combinations):
    if combinations["complexe"]["Yams"] != "/":
        return combinations
    
    if dices.count(dices[0]) == 5:
        combinations["complexe"]["Yams"] = 50
    else:
        combinations["complexe"]["Yams"] = 0
    
    return combinations


def startChecking(dices, combinations):
    return checkSameNumbers(dices, combinations)



def printDicesInRed(dices):
    red_start = "\033[91m"
    red_end = "\033[0m"
    return [f"{red_start}{dice}{red_end}" for dice in dices]
