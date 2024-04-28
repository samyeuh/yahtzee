# TODO: add Chance ? (somme des nombres), sans conditions

def checkSameNumbers(dices, combinations):
    combinations["simple"][0]["score"] = 1 * dices.count(1) if combinations["simple"][0]["score"] == -1 else combinations["simple"][0]["score"]
    combinations["simple"][1]["score"] = 2 * dices.count(2) if combinations["simple"][1]["score"] == -1 else combinations["simple"][1]["score"]
    combinations["simple"][2]["score"] = 3 * dices.count(3) if combinations["simple"][2]["score"] == -1 else combinations["simple"][2]["score"]
    combinations["simple"][3]["score"] = 4 * dices.count(4) if combinations["simple"][3]["score"] == -1 else combinations["simple"][3]["score"]
    combinations["simple"][4]["score"] = 5 * dices.count(5) if combinations["simple"][4]["score"] == -1 else combinations["simple"][4]["score"]
    combinations["simple"][5]["score"] = 6 * dices.count(6) if combinations["simple"][5]["score"] == -1 else combinations["simple"][5]["score"]
    return checkSuite(dices, combinations)
 
def checkSuite(dices, combinations):
    edit_petite_suite = True
    edit_grande_suite = True
    if combinations["complexe"][3]["score"] != -1:
        edit_petite_suite = False
    if combinations["complexe"][4]["score"] != -1:
        edit_grande_suite = False

    if edit_petite_suite:
        petite_suite1 = [i for i in range(1,5)]
        petite_suite2 = [i for i in range(2,6)]
        petite_suite3 = [i for i in range(3,7)]
        ps_list = [petite_suite1, petite_suite2, petite_suite3]
        if any([all(numb in dices for numb in petite_suite) for petite_suite in ps_list]) == True:
            combinations["complexe"][3]["score"] = 30
        else:
            combinations["complexe"][3]["score"] = 0

    if edit_grande_suite:
        grande_suite = [i for i in range(1,6)]
        grande_suite2 = [i for i in range(2,7)]
        gs_list = [grande_suite,grande_suite2]
        if any([all(numb in dices for numb in grande_suite) for grande_suite in gs_list]) == True:
            combinations["complexe"][4]["score"] = 40
        else:
            combinations["complexe"][4]["score"] = 0

            
    return checkFull(dices,combinations)

def checkFull(dices, combinations):
    if combinations["complexe"][2]["score"] != -1:
        return checkBrelan(dices, combinations)

    most_frequent = max(set(dices), key=dices.count)
    less_frequent = min(set(dices), key=dices.count)
    if dices.count(most_frequent) == 3 and dices.count(less_frequent) == 2:
        combinations["complexe"][2]["score"] = 25
    else:
        combinations["complexe"][2]["score"] = 0
    return checkBrelan(dices, combinations)

def checkBrelan(dices, combinations):
    if combinations["complexe"][0]["score"] != -1:
        return checkCarre(dices, combinations)

    most_frequent = max(set(dices), key=dices.count)
    if dices.count(most_frequent) == 3:
        combinations["complexe"][0]["score"] = most_frequent*3
    else:
        combinations["complexe"][0]["score"] = 0
    return checkCarre(dices, combinations)

def checkCarre(dices, combinations):
    if combinations["complexe"][1]["score"] != -1:
        return checkYams(dices, combinations)
    
    most_frequent = max(set(dices), key=dices.count)
    if dices.count(most_frequent) == 4:
        combinations["complexe"][1]["score"] = most_frequent*4
    else:
        combinations["complexe"][1]["score"] = 0
    return checkYams(dices, combinations)


def checkYams(dices, combinations):
    if combinations["complexe"][5]["score"] != -1:
        return checkChance(dices, combinations)
    
    if dices.count(dices[0]) == 5:
        combinations["complexe"][5]["score"] = 50
    else:
        combinations["complexe"][5]["score"] = 0
    
    return checkChance(dices, combinations)

def checkChance(dices, combinations):
    if combinations["complexe"][6]["score"] != -1:
        return combinations
    else:
        combinations["complexe"][6]["score"] = sum(dices)
        return combinations


def startChecking(dices, combinations):
    return checkSameNumbers(dices, combinations)

