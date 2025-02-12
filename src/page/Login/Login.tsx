import './Login.css';
import { useEffect } from 'react';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingPage } from '../LoadingPage/LoadingPage';

export function Login() {
  // TODO: best scores tab

  const { setRoundActive, setGameActive, setScore, loading, setLoading, yahtzeeLogic } = useYahtzeeContext();
  const navigate = useNavigate();
  const location = useLocation();

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
    setLoading(true);
  };

  const handleFadeComplete = () => {
    setGameActive(true);
    setRoundActive(true);
    navigate('/play');
    setLoading(false);
  };

  const openGithub = () => {
    window.open('https://github.com/samyeuh/yahtzee');
}

  if (loading) return <LoadingPage onFadeComplete={handleFadeComplete}/>

  return (
    <>  
      <div className="fullpage">
          <img src="/logo/yahtzee.png" onClick={startGame} className='start-icon' alt="start button"/>
          <img src="/dices/github.png" onClick={openGithub} className='github-icon' alt="github link"/>
      </div>
    </>
  );
}
