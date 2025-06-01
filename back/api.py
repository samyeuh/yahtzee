from scoreManager import ScoreManager
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask, jsonify, request
import os
from prometheus_client import Counter, Gauge, generate_latest, CONTENT_TYPE_LATEST

load_dotenv()

allowed_origins = list(filter(None, [
    os.getenv("VITE_FRONTURL_RENDER"),
    os.getenv("VITE_FRONTURL_PROD"),
    os.getenv("VITE_FRONTURL_LOCAL")
]))

app = Flask(__name__)
CORS(app, origins=allowed_origins)


scoreManager = ScoreManager()

@app.route("/testServer", methods=["GET"])
def testServer():
    return jsonify({"message": "hello world"}), 200

@app.route("/getScores", methods=["GET"])
def getScores():
    scores = scoreManager.getScores()
    print(scores)
    if not scores:
        return jsonify({"message": "No scores found"}), 404
    else:
        return jsonify(scores), 200

@app.route("/addScore", methods=["POST"])
def addScore():
    data = request.json
    if not all(k in data for k in ("icon", "playerName", "score", "date", "details")):
        return jsonify({"error": "Missing fields"}), 400

    scoreManager.addScore(data['icon'], data['playerName'], data['score'], data['date'], data['details'])
    return jsonify({"message": "Score added"}), 200


REQUEST_COUNT = Counter('http_requests_total', 'Nombre total de requêtes HTTP', ['method', 'endpoint', 'http_status'])

@app.after_request
def after_request(response):
    REQUEST_COUNT.labels(request.method, request.path, response.status_code).inc()
    return response

@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

# Métriques personnalisées
dice_rolls = Counter('dice_rolls_total', 'Nombre total de lancers de dés')
games_played = Counter('games_played_total', 'Nombre total de parties jouées')
combination_selected = Counter('combination_selected_total', 'Combinaisons choisies', ['name', 'score'])
score_sum = Gauge('score_average', 'Score moyen des parties')
score_max = Gauge('score_max', 'Score maximum atteint')

# Internal storage pour moyenne (optionnel si tu as une BDD)
_scores = []

# === ROUTES DE TRACKING ===

@app.route("/track/roll", methods=["POST"])
def track_roll():
    dice_rolls.inc()
    return jsonify({"message": "roll tracked"}), 200

@app.route("/track/endGame", methods=["POST"])
def track_end_game():
    data = request.get_json()
    score = data.get("score", None)
    if isinstance(score, (int, float)):
        _scores.append(score)
        score_max.set(max(_scores))
        score_sum.set(sum(_scores) / len(_scores))
    games_played.inc()
    return jsonify({"message": "game end tracked"}), 200

@app.route("/track/combination", methods=["POST"])
def track_combination():
    combo_name = request.args.get("name", "unknown")
    combo_score = request.args.get("score", 0, type=int)
    combination_selected.labels(name=combo_name, score=str(combo_score)).inc()
    return jsonify({"message": f"combination {combo_name} ({combo_score}) tracked"}), 200

@app.route("/track/score", methods=["POST"])
def track_score():
    data = request.get_json()
    score = data.get("score", None)
    if isinstance(score, (int, float)):
        _scores.append(score)
        score_max.set(max(_scores))
        score_sum.set(sum(_scores) / len(_scores))
    return jsonify({"message": "score tracked"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

