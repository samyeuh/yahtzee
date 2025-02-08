from utils import generateTooltipDices
from flask import Flask, jsonify, request
from manager import YamsManager
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

app = Flask(__name__)
yams = YamsManager()
CORS(app, origins=[os.getenv("VITE_FRONTURL")])

sessions = {}

def getMyYahtzeeManager(request):
    id = request.args.get("userId") or request.json.get("userId")
    if id not in sessions:
        sessions[id] = YamsManager()
    return sessions[id]

@app.route("/testServer", methods=["GET"])
def testServer():
    return jsonify({"message":"it works"}), 200

@app.route("/rollDices", methods=["GET"])
def rollDices():
    yams = getMyYahtzeeManager(request)
    nbTurn, dice = yams.rollDices()
    return jsonify({"dices": dice, "nbTurns": nbTurn}), 200

@app.route("/keepDices", methods=["POST"])
def keepDices():
    yams = getMyYahtzeeManager(request)
    dice = request.json['dices']
    dice_indices = [int(d) for d in dice]
    yams.keepDices(dice_indices)
    return jsonify({"message": "dice perfectly keeped"}), 200

@app.route("/calculateScores")
def calculateScores():
    yams = getMyYahtzeeManager(request)
    yams.calculateScores()
    return jsonify({"message": "score perfectly calculated"}), 200
    
@app.route("/getCombinations", methods=["GET"])
def getCombinations():
    yams = getMyYahtzeeManager(request)
    return jsonify(yams.getCombinations()), 200


@app.route("/initRound", methods=["POST"])
def initRound():
    yams = getMyYahtzeeManager(request)
    yams.initRound()
    return jsonify({"message": "round perfectly initied"}), 200

@app.route("/setCombinations", methods=["POST"])
def setCombinations():
    yams = getMyYahtzeeManager(request)
    combinations = request.json["combinations"]
    yams.setCombinations(combinations)
    return jsonify({"message": "combinations perfectly setted"}), 200

@app.route('/restartGame', methods=["POST"])
def restartGame():
    yams = getMyYahtzeeManager(request)
    yams.restartGame()
    return jsonify({"message": "game perfectly restarted"}), 200

@app.route('/updateScore', methods=["POST"])
def updateScore():
    try:
        yams = getMyYahtzeeManager(request)
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
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
