from flask import Flask, jsonify, request
from flask_cors import CORS
from yams_manager import YamsManager

app = Flask(__name__)
CORS(app)
# TODO: add all method type (get post)
@app.route("/hello")
def hello():
    return "Hello World!"

@app.route("/rollDices")
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
    
@app.route("/getCombinations")
def getCombinations():
    return jsonify(yams.getCombinations())

@app.route("/initRound")
def initRound():
    yams.initRound()
    return jsonify({"success": True}), 200

@app.route("/setCombinations", methods=["POST"])
def setCombinations():
    combinations = request.json["combinations"]
    yams.setCombinations(combinations)
    return jsonify({"success": True}), 200

@app.route('/getRandomPseudo')
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

if __name__ == "__main__":
    yams = YamsManager()
    app.run()
