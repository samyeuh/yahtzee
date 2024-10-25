import axios from 'axios';
import { useCallback } from 'react';

interface APIFunctions {
  rollDices: () => Promise<any>; 
  keepDices: (dices: number[]) => Promise<any>;
  calculateScores(): Promise<any>;
  initRound(): Promise<any>;
}

export function RollingDicesAPI(): APIFunctions {

  const API_BASE_URL = 'http://127.0.0.1:5000';

  const rollDices = useCallback(() => {
    return axios.get(`${API_BASE_URL}/rollDices`)
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const keepDices = useCallback((dices: number[]) => {
      return axios.post(`${API_BASE_URL}/keepDices`, {
          dices
      }).then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const calculateScores = useCallback(() => {
    return axios.get(`${API_BASE_URL}/calculateScores`)
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const initRound = useCallback(() => {
    return axios.post(`${API_BASE_URL}/initRound`)
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [])

  return { rollDices, keepDices, calculateScores, initRound };
}