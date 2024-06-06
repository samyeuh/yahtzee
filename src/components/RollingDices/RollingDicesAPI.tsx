import axios from 'axios';
import { useCallback } from 'react';

interface APIFunctions {
  rollDices: () => Promise<any>; 
  keepDices: (dices: number[]) => Promise<any>;
  calculateScores(): Promise<any>;
  initRound(): Promise<any>;
}

export function RollingDicesAPI(): APIFunctions {


  const rollDices = useCallback(() => {
    return axios.get(`http://localhost:5000/rollDices`)
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const keepDices = useCallback((dices: number[]) => {
      return axios.post(`http://localhost:5000/keepDices`, {
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
    return axios.get(`http://localhost:5000/calculateScores`)
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const initRound = useCallback(() => {
    return axios.post(`http://localhost:5000/initRound`)
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