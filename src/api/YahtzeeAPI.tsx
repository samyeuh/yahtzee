import axios from 'axios';
import { useCallback } from 'react';

export function YahtzeeAPI() {

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
  }, []);

  const testServer = useCallback(() => {
    return axios.get(`${API_BASE_URL}/testServer`)
      .then((response) => {
        const status = response.status;
        return status;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return { getCombinations, getTooltipDices, setCombinations, updateScore, restartGame, rollDices, keepDices, calculateScores, initRound, testServer};
}