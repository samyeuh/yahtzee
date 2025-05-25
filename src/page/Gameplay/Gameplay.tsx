import { useEffect, useRef, useState } from 'react';
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

  const { gameActive, setGameActive, setRoundActive, setScore, setResetTab, yahtzeeLogic, time, setTime } = useYahtzeeContext();
  const { testServer } = YahtzeeAPI();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRuleModal, setOpenRuleModal] = useState<boolean>(false);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
  const [, setIsTimerActive] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gameActive) {
      handleReplay();
    } else {
      testServer();
      setOpenModal(true);
      setOpenRuleModal(true);
      setGameActive(true);
    }
    
    return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

    const tick = () => {
        if (startTimeRef.current !== null) {
        const now = Date.now();
        setTime(now - startTimeRef.current);
        rafRef.current = requestAnimationFrame(tick);
        }
    };

      const handleStart = () => {
        startTimeRef.current = Date.now() - time;
        setIsTimerActive(true);
        rafRef.current = requestAnimationFrame(tick);
      };

    const handleStop = () => {
        setIsTimerActive(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    };

      const handleReset = () => {
        handleStop();
        setTime(0);
        startTimeRef.current = null;
      };

  const handleReplay = () => {
      yahtzeeLogic.restartGame();
      setResetTab(true);
      setScore(0);
      setGameActive(true);
      setRoundActive(true);
      handleReset();
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
          { gameActive ? (<RollingDices openRules={openRules} startTimer={handleStart}/>) : (<EndRolling openScoreSaving={openScoreSaving} openRules={openRules} handleReplay={handleReplay}/>)}
        </div>
        <div className='tabs'>
          <Combinations stopTimer={handleStop}/>
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
