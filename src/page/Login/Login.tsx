import './Login.css';
import { useEffect, useState } from 'react';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import { useNavigate } from 'react-router-dom';
import { CombinationsAPI } from '../../components/Combinations/CombinationsAPI';
import { LoadingPage } from '../LoadingPage/LoadingPage';

export function Login() {
  // TODO: best scores tab (IN A FUTUR VERSION ?)

  const { setRoundActive, setGameActive, setScore, loading, setLoading } = useGameplayContext();
  const { restartGame } = CombinationsAPI();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<boolean>(true);

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
    setErrorMessage(true);
    setLoading(true);
  };

  const handleFadeComplete = () => {
    setGameActive(true);
    setRoundActive(true);
    navigate('/play');  // Naviguer une fois l'effet de fondu terminé
    setLoading(false);  // Désactiver l'état de chargement
  };

  if (loading) return <LoadingPage onFadeComplete={handleFadeComplete}/>

  return (
    <>  
      <div className="fullpage">
        <div className="title">
          <h1>yahtzee</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="form">
            <button className="uiverse" onClick={startGame}>
                <div className="wrapper">
                    <span style={{fontWeight: 'bold'}}>play</span> { /* TODO: fix ? */}
                    <div className="circle circle-12"></div>
                    <div className="circle circle-11"></div>
                    <div className="circle circle-10"></div>
                    <div className="circle circle-9"></div>
                    <div className="circle circle-8"></div>
                    <div className="circle circle-7"></div>
                    <div className="circle circle-6"></div>
                    <div className="circle circle-5"></div>
                    <div className="circle circle-4"></div>
                    <div className="circle circle-3"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-1"></div>
                </div>
            </button>
            <p className="errorMessage" hidden={errorMessage}>Please enter a valid username</p>
          </div>
        </div>
      </div>
    </>
  );
}
