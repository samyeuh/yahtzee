from utils import generateTooltipDices
from flask import Flask, jsonify, request
from manager import YamsManager
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route("/rollDices", methods=["GET"])
def rollDices():
    nbTurn, dice = yams.rollDices()
    return jsonify({"dices": dice, "nbTurns": nbTurn}), 200

@app.route("/keepDices", methods=["POST"])
def keepDices():
    dice = request.json['dices']
    dice_indices = [int(d) for d in dice]
    yams.keepDices(dice_indices)

@app.route("/calculateScores")
def calculateScores():
    yams.calculateScores()
    
@app.route("/getCombinations", methods=["GET"])
def getCombinations():
    return jsonify(yams.getCombinations())

@app.route("/initRound", methods=["POST"])
def initRound():
    yams.initRound()

@app.route("/setCombinations", methods=["POST"])
def setCombinations():
    combinations = request.json["combinations"]
    yams.setCombinations(combinations)

@app.route('/restartGame', methods=["POST"])
def restartGame():
    yams.restartGame()

@app.route('/updateScore', methods=["POST"])
def updateScore():
    try:
        print("hey")
        score = request.json["score"]
        yams.addScore(int(score))
        newScore = yams.getScore()
        return jsonify({"score": newScore}), 200
    except Exception as error:
        return jsonify({"error": error}), 500


@app.route('/getTooltipDices', methods=["GET"])
def getTooltipDices(): 
    return jsonify(generateTooltipDices())
    

if __name__ == "__main__":
    yams = YamsManager()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
