import { useEffect, useState } from 'react';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import './Gameplay.css';
import { RollingDices } from '../../components/RollingDices/RollingDices';
import { EndRolling } from '../../components/EndRolling/EndRolling';
import { Combinations } from '../../components/Combinations/Combinations';
import { Rules } from '../../modals/Rules/Rules';
import Navbar from '../../components/Navbar/Navbar';
import { CombinationsAPI } from '../../components/Combinations/CombinationsAPI';
import { useNavigate } from 'react-router-dom';

export function Gameplay() {

  const { gameActive, setGameActive, setRoundActive, setScore, setResetTab } = useGameplayContext();
  const [openModal, setOpenModal] = useState<boolean>(true);
  const { restartGame } = CombinationsAPI();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameActive) {
      navigate('/');
    } else {
      setGameActive(true);
    }
  }, []);

  const handleReplay = async (): Promise<void> => {
    try {
        await restartGame();
        setScore(0);
        setGameActive(true);
        setRoundActive(true);
        setResetTab(true);
    } catch (error) {
        console.error("Erreur :", error);
    }
}

  const openRules = (): void => {
    setOpenModal(true);
    document.body.classList.add('modal-open');    
  }
  
  const closeRules = (): void => {
    setOpenModal(false);
    document.body.classList.remove('modal-open'); 
  }

  return (
  <div className={`navBar ${openModal ? 'blur-backgroud' : ''}`}>
    <Navbar />
    <div className="GameplayContainer">
      <div className={`GameplayPage ${openModal ? 'blur-background' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', }}>
        <div>
          { gameActive ? (<RollingDices openRules={openRules}/>) : (<EndRolling openRules={openRules} handleReplay={handleReplay}/>)}
        </div>
        <div>
          <Combinations />
        </div>
      </div>
            {openModal && (
          <div className="modal-overlay">
            <Rules closeFunction={closeRules} openModal={openModal} />
          </div>
        )}  
      </div>
  </div>
  
  )
}
