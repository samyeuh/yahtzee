from datetime import datetime, timedelta
import json
import pytz
import os
from supabase import Client, create_client

class ScoreManager:
    
    def __init__(self):
        url = os.getenv("SUPABASE_URL") 
        key = os.getenv("SUPABASE_KEY")
        try:
            self.supabase: Client = create_client(url, key)
        except Exception as e:
            print(f"Error initializing Supabase client: {e}")
            self.supabase = None
    
    def isSupabaseConnected(self):
        return self.supabase is not None

    def getScores(self):
        response = self.supabase.table("game_scores").select("*").execute()
        if not response.data:
            return None

        all_scores = response.data
        for score in all_scores:
            score["Icon"] = score.pop("icon")
            score["Nom"] = score.pop("name")
            score["Score"] = score.pop("score")
            score["Date"] = datetime.strptime(score["game_date"], "%Y-%d-%m").strftime("%d/%m/%Y")
            score["Duration"] = score.pop("game_duration", "N/A") # Assuming game_duration is optional
            score["Details"] = score.pop("details")  # JSON direct

        paris_tz = pytz.timezone('Europe/Paris')
        today = datetime.now(paris_tz).date()

        def filter_by_date_range(scores, start_date, end_date):
            return [
                s for s in scores
                if start_date <= datetime.strptime(s["Date"], "%d/%m/%Y").date() <= end_date
            ]

        daily = filter_by_date_range(all_scores, today, today)
        week_start = today - timedelta(days=today.weekday())
        weekly = filter_by_date_range(all_scores, week_start, today)
        monthly = [s for s in all_scores if datetime.strptime(s["Date"], "%d/%m/%Y").month == today.month]

        # Trie par score
        all_scores.sort(key=lambda s: s["Score"], reverse=True)
        daily.sort(key=lambda s: s["Score"], reverse=True)
        weekly.sort(key=lambda s: s["Score"], reverse=True)
        monthly.sort(key=lambda s: s["Score"], reverse=True)

        return {
            "daily": daily,
            "weekly": weekly,
            "monthly": monthly,
            "lifetime": all_scores
        }

    
    def addScore(self, icon, playerName, score, date, duration, details):
        try:
            self.supabase.table("game_scores").insert({
                "icon": icon,
                "name": playerName,
                "score": score,
                "game_date": date,
                "game_duration": duration,
                "details": json.dumps(details)
            }).execute()
        except Exception as e:
            print(f"Error adding score: {e}")
            return False
