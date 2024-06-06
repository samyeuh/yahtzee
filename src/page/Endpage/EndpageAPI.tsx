import axios from 'axios';
import { useCallback } from 'react';

interface APIFunctions {
    restartGame: () => Promise<void>;
}

export function EndpageAPI(): APIFunctions {
  const restartGame = useCallback(() => {
      return axios.post(`http://localhost:5000/restartGame`)
      .then((response) => {
        const data = response.data;
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return { restartGame };
}