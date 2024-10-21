from utils import startChecking
import random

class YamsManager():
    def __init__(self):
        self.score = 0
        self.combinations = {
            "complexe":
                [
                    {'nom': "three of a kind", 'score': -1},
                    {'nom': "four of a kind", 'score': -1},
                    {'nom': "full house", 'score': -1},
                    {'nom': "small straight", 'score': -1},
                    {'nom': "large straight", 'score': -1},
                    {'nom': "yahtzee", 'score': -1},
                    {'nom': "chance", 'score': -1}
                ],
            "simple":
                [
                    {'nom': "aces", 'score': -1},
                    {'nom': "twos", 'score': -1},
                    {'nom': "threes", 'score': -1},
                    {'nom': "fours", 'score': -1},
                    {'nom': "fives", 'score': -1},
                    {'nom': "sixes", 'score': -1}
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
    
    def getScore(self):
        return self.score

    def addScore(self, score):
        self.score = self.score + score

    def restartGame(self):
        self.score = 0
        self.combinations = {
            "complexe":
                [
                    {'nom': "three of a kind", 'score': -1},
                    {'nom': "four of a kind", 'score': -1},
                    {'nom': "full house", 'score': -1},
                    {'nom': "small straight", 'score': -1},
                    {'nom': "large straight", 'score': -1},
                    {'nom': "yahtzee", 'score': -1},
                    {'nom': "chance", 'score': -1}
                ],
            "simple":
                [
                    {'nom': "aces", 'score': -1},
                    {'nom': "twos", 'score': -1},
                    {'nom': "threes", 'score': -1},
                    {'nom': "fours", 'score': -1},
                    {'nom': "fives", 'score': -1},
                    {'nom': "sixes", 'score': -1}
                ]
        }
        self.initRound()