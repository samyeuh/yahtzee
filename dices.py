import random
from yams_utils import startChecking, printDicesInRed
from colorama import Fore

class Dices():

    def __init__(self):
        self.dices = [random.randint(1, 6) for i in range(5)]
        self.dicesKeep = []
        self.nbRolls = 0
    
    
    def roll(self):
        self.nbRolls += 1
        self.display()
        # TO DO: afficher les scores possibles avec les dés obtenus
        initialLengthOfDicesKeep = len(self.dicesKeep)
        nbDiceKeep = int(input(f"Combien de dés voulez-vous garder ? (0-{5 - len(self.dicesKeep)})  "))
        for i in range(nbDiceKeep):
            lengthOfDicesKeep = 1+len(self.dicesKeep)
            diceIndex = int(input(f"Quel dé voulez-vous garder ? ({lengthOfDicesKeep}-5)  "))
            while diceIndex  < lengthOfDicesKeep or diceIndex > 5:
              print("Choix incorrect, rechoisissez")
              diceIndex = int(input(f"Quel dé voulez-vous garder ? ({lengthOfDicesKeep}-5)  "))
            index = (initialLengthOfDicesKeep - diceIndex)-1 if initialLengthOfDicesKeep > diceIndex else (diceIndex-initialLengthOfDicesKeep)-1  
            self.dicesKeep.append(self.dices[index])
            # self.dices.remove(self.dices[index])
        if self.nbRolls == 3:
            while len(self.dicesKeep) + len(self.dices) > 5:
                self.dices.remove(self.dicesKeep[-1])
            self.dices = self.dicesKeep + self.dices
        else:
            self.dices = self.dicesKeep + [random.randint(1, 6) for i in range(5 - len(self.dicesKeep))]
    
    def possibleScores(self, combinations):
        return startChecking(self.dices, combinations)


    def display(self):
        print(f"Lancer {self.nbRolls} :", end= ' ')

        if len(self.dicesKeep) == 0:
            print(*self.dices, sep=' | ')
            return
        elif len(self.dicesKeep) == 5:
            print(*printDicesInRed(self.dices), sep= ' | ')
            return

        print(*printDicesInRed(self.dicesKeep), sep=' | ', end=' ')
        print('|', end= ' ')
        newDices = self.dices
        for i in range(len(self.dicesKeep)):
            newDices.remove(self.dices[0])
        print(*newDices, sep=' | ')
    
    def reset(self):
        self.dices = [random.randint(1, 6) for i in range(5)]
        self.dicesKeep = []
        self.nbRolls = 0
    
    