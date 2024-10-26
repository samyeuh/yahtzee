import axios from 'axios';
import { useCallback } from 'react';

export function YahtzeeAPI(userId: string) {

  const API_BASE_URL = 'https://yahtzee-ygaf.onrender.com';

  const getCombinations = useCallback(() => {
    return axios.get(`${API_BASE_URL}/getCombinations`, {
        params: { userId: userId } 
    }).then((response) => {
        const data = response.data;
        return data;
      }).catch((error) => {
        console.error("Error:", error);
      });
  }, [userId]);

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
      combinations: combinations,
      userId: userId
    }).then((response) => {
      const data = response.data;
      return data;
    }).catch((error) => {
        console.error("Error:", error);
      });
  }, [userId]);

  const updateScore = useCallback((score: number) => {
    return axios.post(`${API_BASE_URL}/updateScore`, {
      score: score,
      userId: userId
    }).then((response) => {
      const data = response.data;
      return data;
    }).catch((error) => {
      console.error("Erreur: " + error);
    });
  }, [userId]);

  const restartGame = useCallback(() => {
    return axios.post(`${API_BASE_URL}/restartGame`, {
        userId: userId
    })
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}, [userId]);

const rollDices = useCallback(() => {
    return axios.get(`${API_BASE_URL}/rollDices`, {
        params: { userId: userId }
    })
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userId]);

  const keepDices = useCallback((dices: number[]) => {
      return axios.post(`${API_BASE_URL}/keepDices`, {
          dices: dices,
          userId: userId
      }).then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userId]);

  const calculateScores = useCallback(() => {
    return axios.get(`${API_BASE_URL}/calculateScores`, {
        params: { userId: userId }
    })
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userId]);

  const initRound = useCallback(() => {
    return axios.post(`${API_BASE_URL}/initRound`, {
        userId: userId
    })
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userId]);

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