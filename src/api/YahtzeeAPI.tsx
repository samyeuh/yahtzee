import axios, { AxiosResponse } from 'axios';
import { useCallback } from 'react';

export function YahtzeeAPI() {
  // TODO: Best scores

  const API_BASE_URL = import.meta.env.VITE_BACKURL_RENDER || import.meta.env.VITE_BACKURL_PROD || import.meta.env.VITE_BACKURL_LOCAL;

  const testServer = useCallback(() => {
    return axios.get(`${API_BASE_URL}/testServer`)
              .then((response: AxiosResponse<any>) => {
                return response.status;
              });
    }, []);

    const testSupabase = useCallback(() => {
      return axios.get(`${API_BASE_URL}/testSupabase`)
                .then((response: AxiosResponse<any>) => {
                  return response.status;
                }).catch((error: any) => {
                  console.error("Erreur: " + error);
                  return 500;
                });
      }, []);


  const getScores = useCallback(() => {
    return axios.get(`${API_BASE_URL}/getScores`)
              .then((response: AxiosResponse<any>) => {
                return response.data;
              }).catch((error: any) => {
                console.error("Erreur: " + error);
              });
    }, []);

    const addScore = useCallback((icon: string, playerName: string, score: number, duration: any, details: any) => {
      let formatDuration = formatTime(duration);
      return axios.post(`${API_BASE_URL}/addScore`, {icon, playerName, score, formatDuration, details})
                .then((response: AxiosResponse<any>) => {
                  return response.data;
                }).catch((error: any) => {
                  console.error("Erreur: " + error);
                });
    }, []);

    const formatTime = (ms: number): string => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const milliseconds = ms % 1000;
      return `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}:` +
            `${milliseconds.toString().padStart(3, '0')}`;
    };

    return { testServer, getScores, addScore, formatTime, testSupabase };
}