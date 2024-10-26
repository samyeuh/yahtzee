import { useEffect, useState } from 'react';
import './LoadingPage.css';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';

interface LoadingPageProps {
  onFadeComplete: () => void;
}

export function LoadingPage({ onFadeComplete }: LoadingPageProps) {
  const gif = "/yahtzee.gif";
  const [fadeOut, setFadeOut] = useState(false);
  const [serverOpen, setServerOpen] = useState(false);
  const { testServer } = YahtzeeAPI();

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleOpenServer();
    }, 3000); 

    if (serverOpen) {
      clearInterval(intervalId);
      setFadeOut(true);
      setTimeout(() => {
        onFadeComplete();
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [serverOpen, onFadeComplete]);

  const handleOpenServer = async (): Promise<void> => {
    try {
      const status = await testServer();
      if (status === 200) {
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
