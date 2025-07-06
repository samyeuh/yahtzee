import './Login.css';
import { useEffect, useState } from 'react';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingPage } from '../LoadingPage/LoadingPage';

export function Login() {
  // TODO: best scores tab

  const { setRoundActive, setGameActive, setScore, loading, setLoading, yahtzeeLogic } = useYahtzeeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [handleFadeComplete, setHandleFadeComplete] = useState<(() => void) | null>(null);
  const [waitServer, setWaitServer] = useState<boolean>(false);

  useEffect(() => {
    whenLoading();

  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  }, [location]);

  const whenLoading = async () => {
    try {
      yahtzeeLogic.restartGame();
      setScore(0);
    } catch (error) {
      console.error("Erreur: " + error);
    }
  };

  const startGame = async (): Promise<void> => {
    loadSounds();
    setHandleFadeComplete(() => startFadeComplete);
    setWaitServer(false);
    setLoading(true);
  };

  const loadSounds = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    ctx.resume();
  }

  const startFadeComplete = () => {
    setGameActive(true);
    setRoundActive(true);
    navigate('/play');
    setLoading(false);
  };

  const openGithub = () => {
    window.open('https://github.com/samyeuh/yahtzee');
  };

  const openTrophy = () => {
    setHandleFadeComplete(() => trophyFadeComplete);
    setWaitServer(true);
    setLoading(true);
  };

  const trophyFadeComplete = () => {
    navigate('/scores');
  };

  if (loading){
    return <LoadingPage onFadeComplete={handleFadeComplete} waitServer={waitServer}/>
  }
  return (
    <>  
      <div className="fullpage">
          <img src="/logo/yahtzee.png" onClick={startGame} className='start-icon' alt="start button"/>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
            <img src="/dices/trophy.png" onClick={openTrophy} className='other-icon' alt="trophy"/>
            <img src="/dices/github.png" onClick={openGithub} className='other-icon' alt="github link"/>
          </div>
      </div>
    </>
  );
}
