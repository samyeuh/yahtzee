import './Login.css';
import { useEffect } from 'react';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from '../LoadingPage/LoadingPage';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';

export function Login() {
  // TODO: best scores tab
  const initializeUser = () => {
    let userId = localStorage.getItem('userId');
    if (!userId){
      userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  const { setRoundActive, setGameActive, setScore, loading, setLoading } = useGameplayContext();
  const { restartGame } = YahtzeeAPI(initializeUser());
  const navigate = useNavigate();

  useEffect(() => {
    whenLoading();
  }, []);

  

  const whenLoading = async () => {
    try {
      await restartGame();
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
          <img src="/yahtzee.png" onClick={startGame} style={{width: "507px", height: "78px"}} alt="start button"/>
          <img src="/dices/github.png" onClick={openGithub} style={{width: "78px", height: "78px", cursor: "pointer", marginTop: "20px"}} alt="github link"/>
      </div>
    </>
  );
}
