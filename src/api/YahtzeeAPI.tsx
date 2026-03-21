import axios, { AxiosResponse } from 'axios';
import { useCallback } from 'react';

export function YahtzeeAPI() {

  const API_BASE_URL = import.meta.env.VITE_BACKURL_RENDER || import.meta.env.VITE_BACKURL_PROD || import.meta.env.VITE_BACKURL_LOCAL;

  const testServer = useCallback(() => {
    return axios.get(`${API_BASE_URL}/testServer`)
      .then((response: AxiosResponse<any>) => response.status);
  }, []);

  const testSupabase = useCallback(() => {
    return axios.get(`${API_BASE_URL}/testSupabase`)
      .then((response: AxiosResponse<any>) => response.status)
      .catch(() => 500);
  }, []);

  const getScores = useCallback(() => {
    return axios.get(`${API_BASE_URL}/getScores`)
      .then((response: AxiosResponse<any>) => response.data)
      .catch((error: any) => { console.error("Erreur: " + error); });
  }, []);

  // Returns the saved score ID
  const addScore = useCallback((icon: string, playerName: string, score: number, duration: any, details: any): Promise<number> => {
    const formatDuration = formatTime(duration);
    return axios.post(`${API_BASE_URL}/addScore`, { icon, playerName, score, formatDuration, details })
      .then((response: AxiosResponse<any>) => response.data.id)
      .catch((error: any) => { throw error; });
  }, []);

  // Updates name and icon of an existing score by ID
  const updateScore = useCallback((id: number, icon: string, playerName: string): Promise<void> => {
    return axios.put(`${API_BASE_URL}/updateScore`, { id, icon, playerName })
      .then(() => {})
      .catch((error: any) => { throw error; });
  }, []);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes.toString().padStart(2, '0')}:` +
           `${seconds.toString().padStart(2, '0')}:` +
           `${milliseconds.toString().padStart(3, '0')}`;
  };

  return { testServer, getScores, addScore, updateScore, formatTime, testSupabase };
}