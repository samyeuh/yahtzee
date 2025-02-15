import axios from 'axios';
import { useCallback } from 'react';

export function YahtzeeAPI() {
  // TODO: Best scores

  const API_BASE_URL = import.meta.env.VITE_BACKURL_RENDER || import.meta.env.VITE_BACKURL_PROD || import.meta.env.VITE_BACKURL_LOCAL;

  const testServer = useCallback(() => {
    return axios.get(`${API_BASE_URL}/testServer`)
              .then((response) => {
                return response.status;
              });
    }, []);

  const getScores = useCallback(() => {
    return axios.get(`${API_BASE_URL}/getScores`)
              .then((response) => {
                return response.data;
              }).catch((error) => {
                console.error("Erreur: " + error);
              });
    }, []);

    const addScore = useCallback((icon: string, playerName: string, score: number, date: string, details: any) => {
      return axios.post(`${API_BASE_URL}/addScore`, {icon, playerName, score, date, details})
                .then((response) => {
                  return response.data;
                }).catch((error) => {
                  console.error("Erreur: " + error);
                });
    }, []);

    return { testServer, getScores, addScore };
}