import { useEffect, useState } from 'react';
import './LoadingPage.css'
import { LoadingPageAPI } from './LoadingPageAPI';

interface LoadingPageProps {
  onFadeComplete: () => void;
}

export function LoadingPage({ onFadeComplete }: LoadingPageProps) {
  const gif = "/yahtzee.gif";
  const [fadeOut, setFadeOut] = useState(false);
  const [serverOpen, setServerOpen] = useState(false);
  const { testServer } = LoadingPageAPI();

  useEffect(() => {
    while (serverOpen == false){
      handleOpenServer(); 
    }
    
    setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    setTimeout(() => {
      onFadeComplete();  
    }, 2000);  
  }, [onFadeComplete]);

  const handleOpenServer = async (): Promise<void> => {
    try {
        let status = await testServer();
        if (status == 200){
            setServerOpen(true);
        }
    } catch (error) {
        console.error("Error: ", error);
    }
}

  return (
    <div className={`loading-page ${fadeOut ? 'fade-out' : ''}`}>
      <img src={gif} alt="Loading..." />
    </div>
  );
}