from utils import savingScore, getScoreTable
from flask import Flask, jsonify, request
from manager import YamsManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/hello")
def hello():
    return "Hello World!"

@app.route("/rollDices", methods=["GET"])
def rollDices():
    nbTurn, dice = yams.rollDices()
    return jsonify({"dices": dice, "nbTurns": nbTurn}), 200

@app.route("/keepDices", methods=["POST"])
def keepDices():
    try:
        dice = request.json['dices']
        dice_indices = [int(d) for d in dice]
        yams.keepDices(dice_indices)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/calculateScores")
def calculateScores():
    try:
        yams.calculateScores()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route("/getCombinations", methods=["GET"])
def getCombinations():
    return jsonify(yams.getCombinations())

@app.route("/initRound", methods=["POST"])
def initRound():
    yams.initRound()
    return jsonify({"success": True}), 200

@app.route("/setCombinations", methods=["POST"])
def setCombinations():
    combinations = request.json["combinations"]
    yams.setCombinations(combinations)
    return jsonify({"success": True}), 200

@app.route('/getRandomPseudo', methods=["GET"])
def getRandomPseudo():
    pseudo = yams.getRandomPseudo()
    return jsonify({"pseudo": pseudo}), 200

@app.route('/restartGame', methods=["POST"])
def restartGame():
    yams.restartGame()
    return jsonify({"success": True}), 200

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
    
@app.route('/saveScore', methods=["POST"])
def savePlayerScore():
    savingScore(playerName="samy", score="100")
    return jsonify({"succes": True}), 200

@app.route('/getScoreTable', methods=["GET"])
def getScoreTable():
    var = getScoreTable()
    

if __name__ == "__main__":
    yams = YamsManager()
    app.run()
