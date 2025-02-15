import { useEffect, useState } from 'react';
import './LoadingPage.css';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';

interface LoadingPageProps {
  onFadeComplete: (() => void) | null;
  waitServer: boolean;
}

export function LoadingPage({ onFadeComplete, waitServer }: LoadingPageProps) {

  const gif = "/logo/yahtzee.gif";
  const [fadeOut, setFadeOut] = useState(false);
  const [serverOpen, setServerOpen] = useState(false);
  const { testServer } = YahtzeeAPI();
  var intervalId: any = null;

  const handleWaitServer = async (): Promise<void> => {
    try {
      const status = await testServer();
      if (status === 200) {
        setServerOpen(true);
      }
    } catch (error) {
      console.error("Error: ", error);
    } 
  };

  useEffect(() => {
    if (waitServer) {
      intervalId = setInterval(() => {
        handleWaitServer();
      }, 3000);
    } else {
      setServerOpen(true);
    }
    if (serverOpen) {
      if (!onFadeComplete) {
        return;
      }

      setTimeout(() => {
        if (waitServer) {
          clearInterval(intervalId);
        }
        setFadeOut(true);
        setTimeout(() => {
          onFadeComplete();
        }, 1000);
      }, 2000);
    }

    return () => clearInterval(intervalId);
  }, [serverOpen, onFadeComplete]);

  return (
    <div className={`loading-page ${fadeOut ? 'fade-out' : ''}`}>
      <img src={gif} alt="Loading..." />
    </div>
  );
}
