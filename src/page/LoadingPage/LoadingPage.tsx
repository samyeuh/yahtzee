import { useEffect, useState } from 'react';
import './LoadingPage.css';

interface LoadingPageProps {
  onFadeComplete: () => void;
}

export function LoadingPage({ onFadeComplete }: LoadingPageProps) {

  const gif = "/logo/yahtzee.gif";
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onFadeComplete();
      }, 1000);
    }, 2000);
  }, [onFadeComplete]);

  return (
    <div className={`loading-page ${fadeOut ? 'fade-out' : ''}`}>
      <img src={gif} alt="Loading..." />
    </div>
  );
}
