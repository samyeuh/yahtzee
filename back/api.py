from ast import match_case
from scoreManager import ScoreManager
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask, jsonify, request
import os
from prometheus_client import Counter, Gauge, Histogram, generate_latest, CONTENT_TYPE_LATEST

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

# Métriques
dice_rolls = Counter('dice_rolls_total', 'Nombre total de lancers de dés')
games_played = Counter('games_played_total', 'Nombre total de parties jouées')
combination_selected = Counter('combination_selected_total', 'Combinaisons choisies', ['name', 'score'])

score_sum = Gauge('score_average', 'Score moyen des parties')
score_max = Gauge('score_max', 'Score maximum atteint')
score_count = Counter("score_total", "Score brut envoyé", ["value"])
game_duration_min = Gauge('time_min', 'Partie la plus rapide')
game_duration_avg = Gauge('time_average', 'Temps moyen pour une partie')

_scores = []
_game_durations = []

# === ROUTES DE TRACKING ===
@app.route("/track/roll", methods=["POST"])
def track_roll():
    dice_rolls.inc()
    return jsonify({"message": "roll tracked"}), 200

def get_score_bucket(score):
    ranges = [0, 50, 100, 150, 170, 190, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 320]
    for i in range(len(ranges) - 1):
        if ranges[i] <= score < ranges[i + 1]:
            return f"{ranges[i]}-{ranges[i + 1]}"
    return f">{ranges[-1]}"



@app.route("/track/endGame", methods=["POST"])
def track_end_game():
    score = request.args.get("score", 0, type=int)
    time = request.args.get("time", 0, type=float)
    if isinstance(time, (int, float)):
        _game_durations.append(time)
        game_duration_min.set(min(_game_durations))
        game_duration_avg.set(sum(_game_durations) / len(_game_durations))
        
    if isinstance(score, (int, float)):
        _scores.append(score)
        score_max.set(max(_scores))
        score_sum.set(sum(_scores) / len(_scores))
            
        score_count.labels(value=get_score_bucket(score)).inc()
    games_played.inc()
    return jsonify({"message": "game end tracked"}), 200

@app.route("/track/combination", methods=["POST"])
def track_combination():
    combo_name = request.args.get("name", "unknown")
    combo_score = request.args.get("score", 0, type=int)
    combination_selected.labels(name=combo_name, score=str(combo_score)).inc()
    return jsonify({"message": f"combination {combo_name} ({combo_score}) tracked"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

