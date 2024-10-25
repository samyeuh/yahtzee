from utils import generateTooltipDices
from flask import Flask, jsonify, request
from manager import YamsManager
from flask_cors import CORS
import os

app = Flask(__name__)
yams = YamsManager()
CORS(app)

@app.route("/testServer", methods=["GET"])
def testServer():
    return jsonify({"message":"it works"}), 200

@app.route("/rollDices", methods=["GET"])
def rollDices():
    nbTurn, dice = yams.rollDices()
    return jsonify({"dices": dice, "nbTurns": nbTurn}), 200

@app.route("/keepDices", methods=["POST"])
def keepDices():
    dice = request.json['dices']
    dice_indices = [int(d) for d in dice]
    yams.keepDices(dice_indices)
    return jsonify({"message": "dice perfectly keeped"}), 200

@app.route("/calculateScores")
def calculateScores():
    yams.calculateScores()
    return jsonify({"message": "score perfectly calculated"}), 200
    
@app.route("/getCombinations", methods=["GET"])
def getCombinations():
    return jsonify(yams.getCombinations()), 200


@app.route("/initRound", methods=["POST"])
def initRound():
    yams.initRound()
    return jsonify({"message": "round perfectly initied"}), 200

@app.route("/setCombinations", methods=["POST"])
def setCombinations():
    combinations = request.json["combinations"]
    yams.setCombinations(combinations)
    return jsonify({"message": "combinations perfectly setted"}), 200

@app.route('/restartGame', methods=["POST"])
def restartGame():
    yams.restartGame()
    return jsonify({"message": "game perfectly restarted"}), 200

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
    return jsonify(generateTooltipDices()), 200
    

if __name__ == "__main__":
    app.run()
