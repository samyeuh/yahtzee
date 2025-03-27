import { useEffect, useState } from 'react';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext';
import './Gameplay.css';
import { RollingDices } from '../../components/RollingDices/RollingDices';
import { EndRolling } from '../../components/EndRolling/EndRolling';
import { Combinations } from '../../components/Combinations/Combinations';
import { Rules } from '../../modals/Rules/Rules';
import Navbar from '../../components/Navbar/Navbar';
import { ScoreSaving } from '../../modals/ScoreSaving/ScoreSaving';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';

export function Gameplay() {

  const { gameActive, setGameActive, setRoundActive, setScore, setResetTab, yahtzeeLogic } = useYahtzeeContext();
  const { testServer } = YahtzeeAPI();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRuleModal, setOpenRuleModal] = useState<boolean>(false);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);

  useEffect(() => {
    if (!gameActive) {
      handleReplay();
    } else {
      testServer();
      setOpenModal(true);
      setOpenRuleModal(true);
      setGameActive(true);
    }
  }, []);

  const handleReplay = async (): Promise<void> => {
    try {
        yahtzeeLogic.restartGame();
        setScore(0);
        setGameActive(true);
        setRoundActive(true);
        setResetTab(true);
    } catch (error) {
        console.error("Erreur :", error);
    }
}

  const openScoreSaving = (): void => {
    setOpenModal(true);
    setOpenSaveModal(true);
    document.body.classList.add('modal-open');
  }

  const closeScoreSaving = (): void => {
    setOpenModal(false);
    setOpenSaveModal(false);
    document.body.classList.remove('modal-open');
  }

  const openRules = (): void => {
    setOpenModal(true);
    setOpenRuleModal(true);
    document.body.classList.add('modal-open');    
  }
  
  const closeRules = (): void => {
    setOpenModal(false);
    setOpenRuleModal(false);
    document.body.classList.remove('modal-open'); 
  }

  return (
  <div className={`navBar ${openModal ? 'blur-backgroud' : ''}`}>
    <Navbar />
    <div className="GameplayContainer">
      <div className={`GameplayPage ${openModal ? 'blur-background' : ''}`}>
        <div>
          { gameActive ? (<RollingDices openRules={openRules}/>) : (<EndRolling openScoreSaving={openScoreSaving} openRules={openRules} handleReplay={handleReplay}/>)}
        </div>
        <div className='tabs'>
          <Combinations />
        </div>
      </div>
            {openModal && openRuleModal && (
              <div className="modal-overlay">
                <Rules closeFunction={closeRules} openModal={openModal} openRuleModal={openRuleModal} />
              </div>
              ) ||
              openModal && openSaveModal && (
                <div className="modal-overlay">
                  <ScoreSaving closeFunction={closeScoreSaving} openModal={openModal} openSaveModal={openSaveModal} />
                </div>
              )
          }
      </div>
  </div>
  
  )
}
