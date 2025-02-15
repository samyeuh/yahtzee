import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta
import json

class ScoreManager:
    
    def __init__(self):
        self.playersScorePath = Path('./public/data/playersScore.csv')
        if not self.playersScorePath.exists():
            pd.DataFrame(columns=['Icon', 'Nom', 'Score', 'Date', 'Details']).to_csv(self.playersScorePath, index=False)
        self.playersScore = pd.read_csv(self.playersScorePath)

    def getScores(self):
        self.playersScore.sort_values(by='Score', ascending=False, inplace=True)
        today = datetime.today().date()
        date_col = pd.to_datetime(self.playersScore["Date"], format="%d/%m/%Y", errors='coerce')
        
        daily_scores = self.playersScore[date_col.dt.date == today]
        
        start_of_week = today - timedelta(days=today.weekday())
        weekly_scores = self.playersScore[date_col.dt.date >= start_of_week]
        
        monthly_record = self.playersScore[(date_col.dt.month == today.month) & (date_col.dt.year == today.year)]
        
        lifetime_record = self.playersScore
        
        return {
            "daily": daily_scores.to_dict(orient='records'),
            "weekly": weekly_scores.to_dict(orient='records'),
            "monthly": monthly_record.to_dict(orient='records'),
            "lifetime": lifetime_record.to_dict(orient='records')
        }

    
    def addScore(self, icon, playerName, score, date, details):
        self.playersScore.sort_values(by='Score', ascending=False, inplace=True)

        new_score = {
            "Icon": icon,
            "Nom": playerName,
            "Score": score,
            "Date": date,
            "Details": json.dumps(details)
        }
        
        self.playersScore.loc[len(self.playersScore.index)] = new_score
        self.saveScores()
        
    def saveScores(self):
        self.playersScore.to_csv(self.playersScorePath, index=False)
        self.playersScore = pd.read_csv(self.playersScorePath)
