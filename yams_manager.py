from dices import Dices
import json
import copy

class YamsManager():
    
    def __init__(self):
        self.score = 0
        self.dices = Dices()
        self.combinations = {
            "complexe":
                {
                    "Brelan": "/",
                    "Carré": "/",
                    "Full": "/",
                    "Petite Suite": "/",
                    "Grande Suite": "/",
                    "Yams": "/"
                },
            "simple":
                {
                    "Un": "/",
                    "Deux": "/",
                    "Trois": "/",
                    "Quatre": "/",
                    "Cinq": "/",
                    "Six": "/"
                }
        }
        self.selectedCombi = []
    
    def startPlaying(self):
        print("C'est parti pour votre parti de Yams :)")
        self.play(self.dices)

    def checkGameOver(self):
        return len(self.selectedCombi) == 12

    def play(self, dices):
        while not self.checkGameOver():
            dices.roll()
            self.checkEndOfTurn(dices)
        print(f"Votre score: {self.score}")
        print("Bravo ! Merci d'avoir jouer :)")

    def checkEndOfTurn(self, dices):
        if dices.nbRolls == 3:
            self.chooseCombination(dices)
            self.newTurn()
        elif len(dices.dicesKeep) == 5:
            self.chooseCombination(dices)
            self.newTurn()
        else:
            self.play(dices)
    
    def newTurn(self):
        print("=============================================")
        print("Tour terminé !")
        self.dices.reset()
        print(f"Votre score: {self.score}")
        print("=============================================")
        print("==== Nouveau tour ====")

    def chooseCombination(self, dices):
        print("Voici vos dés finaux: ")
        print(*dices.dices, sep=' | ')
        print("Combinaisons possibles:")
        combinationCopy = copy.deepcopy(self.combinations)
        possibleCombinations = dices.possibleScores(combinationCopy)
        for type in possibleCombinations.keys():
            print("-------------------------------------")
            print(f"             {type}                ")
            for combi in possibleCombinations[type].keys():
                print(f"{combi} : {possibleCombinations[type][combi]}")
        
        complexe = ["brelan", "carré","full","petite suite", "grande suite", "yams"]
        simple = ["un","deux","trois", "quatre", "cinq", "six"]
        chosenScoreType = input("Quel combinaisons choisissez-vous ? ").lower()
        while chosenScoreType not in  complexe+simple or chosenScoreType in self.selectedCombi:
            print("Choix incorrect, veuillez recommencer.")
            chosenScoreType = input("Quel combinaisons choisissez-vous ? ")
        
        if chosenScoreType in complexe:
            self.score += possibleCombinations["complexe"][chosenScoreType.title()]
            temp = f"\033[91m{possibleCombinations['complexe'][chosenScoreType.title()]}\033[0m"
            self.combinations["complexe"][chosenScoreType.title()] = temp
        elif chosenScoreType in simple:
            self.score += possibleCombinations["simple"][chosenScoreType.title()]
            temp = f"\033[91m{possibleCombinations['simple'][chosenScoreType.title()]}\033[0m"
            self.combinations["simple"][chosenScoreType.title()] = temp
        
        self.selectedCombi.append(chosenScoreType)
        


if __name__ == "__main__":
    yams = YamsManager()
    yams.startPlaying()