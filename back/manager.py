from utils import startChecking
import random
import copy

class YamsManager():
    def __init__(self):
        self.pseudoGenerator = ["boloss72"]
        self.score = 0
        self.combinations = {
            "complexe":
                [
                    {'nom': "Brelan", 'score': -1},
                    {'nom': "Carré", 'score': -1},
                    {'nom': "Full", 'score': -1},
                    {'nom': "Petite Suite", 'score': -1},
                    {'nom': "Grande Suite", 'score': -1},
                    {'nom': "Yams", 'score': -1},
                    {'nom': "Chance", 'score': -1}
                ],
            "simple":
                [
                    {'nom': "Un", 'score': -1},
                    {'nom': "Deux", 'score': -1},
                    {'nom': "Trois", 'score': -1},
                    {'nom': "Quatre", 'score': -1},
                    {'nom': "Cinq", 'score': -1},
                    {'nom': "Six", 'score': -1}
                ]
        }
        self.initRound()


    def initRound(self):
        self.nbTurn = 3
        self.diceKeep = []
        self.dice = [0,0,0,0,0]


    def rollDices(self):
        for i in range(5):
            self.dice[i] = random.randint(1, 6) if i not in self.diceKeep else self.dice[i]
        self.nbTurn = self.nbTurn - 1
        return self.nbTurn, self.dice
    
    def keepDices(self, dices):
        self.diceKeep = dices

    def calculateScores(self):
        self.combinations = startChecking(self.dice, self.combinations)

    def getCombinations(self):
        return self.combinations

    def setCombinations(self, combinations):
        self.combinations = combinations

    def getRandomPseudo(self):
        i = random.randint(0, len(self.pseudoGenerator))
        return self.pseudoGenerator[i]
    
    def getScore(self):
        return self.score

    def addScore(self, score):
        self.score = self.score + score

    def restartGame(self):
        self.score = 0
        self.combinations = {
            "complexe":
                [
                    {'nom': "Brelan", 'score': -1},
                    {'nom': "Carré", 'score': -1},
                    {'nom': "Full", 'score': -1},
                    {'nom': "Petite Suite", 'score': -1},
                    {'nom': "Grande Suite", 'score': -1},
                    {'nom': "Yams", 'score': -1},
                    {'nom': "Chance", 'score': -1}
                ],
            "simple":
                [
                    {'nom': "Un", 'score': -1},
                    {'nom': "Deux", 'score': -1},
                    {'nom': "Trois", 'score': -1},
                    {'nom': "Quatre", 'score': -1},
                    {'nom': "Cinq", 'score': -1},
                    {'nom': "Six", 'score': -1}
                ]
        }
        self.initRound()