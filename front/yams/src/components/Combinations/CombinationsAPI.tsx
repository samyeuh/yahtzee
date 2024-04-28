import axios from 'axios';
import { useCallback } from 'react';

interface APIFunctions {
    getCombinations(): Promise<any>;
    setCombinations(combinations: any): Promise<any>;
    updateScore(score: number): Promise<any>;
}

export function CombinationsAPI(): APIFunctions {

  const getCombinations = useCallback(() => {
    return axios.get(`http://localhost:5000/getCombinations`)
      .then((response) => {
        const data = response.data;
        return data;
      }).catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const setCombinations = useCallback((combinations: any) => {
    return axios.post(`http://localhost:5000/setCombinations`, {
      combinations: combinations
    }).then((response) => {
      const data = response.data;
      return data;
    }).catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const updateScore = useCallback((score: number) => {
    return axios.post(`http://localhost:5000/updateScore`, {
      score: score
    }).then((response) => {
      const data = response.data;
      return data;
    }).catch((error) => {
      console.error("Erreur: " + error);
    });
  }, []);

  return { getCombinations, setCombinations, updateScore };
}