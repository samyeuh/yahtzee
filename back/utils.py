from scoreCalculator import checkSameNumbers
from exampleGenerator import generateComplexeExample
from datetime import datetime
import pandas as p
import csv
import pytz

def startChecking(dices, combinations):
    return checkSameNumbers(dices, combinations)

def savingScore(playerName, score):
    csvPath = ".\data\playersScore.csv"
    date = datetime.now(pytz.timezone("Europe/Paris"))
    originalCsv = p.read_csv(csvPath, index_col=False)
    newLine = {"Nom": playerName, "Score": score, "Date": date.strftime("%d/%m/%Y")}
    newLineDF = p.DataFrame(newLine, index=[0])
    newCsv = p.concat([originalCsv, newLineDF])
    newCsv.to_csv(csvPath, index=False, quoting=csv.QUOTE_ALL)

def getScoreTable():
    print("ok")

def generateTooltipDices():
    combi = {
                'threeOfAKind': [],
                'fourOfAKind': [],
                'fullHouse': [],
                'smallStraight': [],
                'largeStraight': [],
                'yahtzee': [],
                'chance': []
    }
    return generateComplexeExample(combi)

    