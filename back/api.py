from supabase import create_client
from scoreManager import ScoreManager
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask, jsonify, request
import os

load_dotenv()

allowed_origins = list(filter(None, [
    os.getenv("VITE_FRONTURL_RENDER"),
    os.getenv("VITE_FRONTURL_PROD"),
    os.getenv("VITE_FRONTURL_LOCAL")
]))

app = Flask(__name__)
CORS(app, origins=allowed_origins)

_manager = None

def get_manager():
    global _manager
    if _manager is None or not _manager.isSupabaseConnected():
        print("Tentative de connexion à Supabase...", flush=True)
        _manager = ScoreManager()
    return _manager

@app.route("/testServer", methods=["GET"])
def testServer():
    return jsonify({"message": "hello world"}), 200

@app.route("/testSupabase", methods=["GET"])
def testSupabase():
    scoreManager = get_manager()
    if scoreManager.isSupabaseConnected():
        return jsonify({"message": "Supabase connected"}), 200
    else:
        return jsonify({"message": "Supabase not connected"}), 500

@app.route("/getScores", methods=["GET"])
def getScores():
    scoreManager = get_manager()
    if not scoreManager.isSupabaseConnected():
        return jsonify({"message": "Supabase not connected"}), 500
    scores = scoreManager.getScores()
    print(scores)
    if not scores:
        return jsonify({"message": "No scores found"}), 404
    else:
        return jsonify(scores), 200

@app.route("/addScore", methods=["POST"])
def addScore():
    scoreManager = get_manager()
    if not scoreManager.isSupabaseConnected():
        return jsonify({"message": "Supabase not connected"}), 500
    data = request.json
    if not all(k in data for k in ("icon", "playerName", "score", "date", "formatDuration", "details")):
        return jsonify({"error": "Missing fields"}), 400

    scoreManager.addScore(data['icon'], data['playerName'], data['score'], data['date'], data['formatDuration'], data['details'])
    return jsonify({"message": "Score added"}), 200
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

