import axios from 'axios';
import { useCallback } from 'react';

interface APIFunctions {
   testServer: () => Promise<any>; 
}

export function LoadingPageAPI(): APIFunctions {

  const API_BASE_URL = 'https://yahtzee-ygaf.onrender.com';

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

  return { testServer };
}