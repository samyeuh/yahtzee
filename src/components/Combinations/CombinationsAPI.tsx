import axios from 'axios';
import { useCallback } from 'react';

interface APIFunctions {
    getCombinations(): Promise<any>;
    getTooltipDices(): Promise<any>;
    setCombinations(combinations: any): Promise<any>;
    updateScore(score: number): Promise<any>;
    restartGame(): Promise<any>;
}

export function CombinationsAPI(): APIFunctions {

  const API_BASE_URL = 'http://127.0.0.1:5000';

  const getCombinations = useCallback(() => {
    return axios.get(`${API_BASE_URL}/getCombinations`)
      .then((response) => {
        const data = response.data;
        return data;
      }).catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const getTooltipDices = useCallback(() => {
    return axios.get(`${API_BASE_URL}/getTooltipDices`)
    .then((response) => {
      const data = response.data;
      return data;
    }).catch((error) => {
      console.error("Error:", error);
    });
  }, []);

  const setCombinations = useCallback((combinations: any) => {
    return axios.post(`${API_BASE_URL}/setCombinations`, {
      combinations: combinations
    }).then((response) => {
      const data = response.data;
      return data;
    }).catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const updateScore = useCallback((score: number) => {
    return axios.post(`${API_BASE_URL}/updateScore`, {
      score: score
    }).then((response) => {
      const data = response.data;
      return data;
    }).catch((error) => {
      console.error("Erreur: " + error);
    });
  }, []);

  const restartGame = useCallback(() => {
    return axios.post(`${API_BASE_URL}/restartGame`)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}, []);

  return { getCombinations, getTooltipDices, setCombinations, updateScore, restartGame };
}