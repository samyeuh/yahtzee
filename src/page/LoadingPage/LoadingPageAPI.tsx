import axios from 'axios';
import { useCallback } from 'react';

interface APIFunctions {
   testServer: () => Promise<any>; 
}

export function LoadingPageAPI(): APIFunctions {

  const API_BASE_URL = 'http://127.0.0.1:5000';

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