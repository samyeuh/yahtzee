import './ScoreSaving.css';
import { useState } from 'react';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';

type RulesProps = {
  closeFunction: () => void;
  openModal: boolean;
  openSaveModal: boolean;
};

export function ScoreSaving({ closeFunction, openModal, openSaveModal }: RulesProps) {

  const icons = import.meta.glob("/src/assets/icons/*.png", { eager: true });

  const iconsArray = Object.values(icons).map((icon: any) => icon.default);
  const [currentIcon, setCurrentIcon] = useState<string>(iconsArray[0]);
  const [currentLeftArrow, setCurrentLeftArrow] = useState<string>('/utils/left_arrow.png');
  const [currentRightArrow, setCurrentRightArrow] = useState<string>('/utils/right_arrow.png');
  const [saving , setSaving] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const date = new Date().toLocaleDateString();
  const { addScore, formatTime } = YahtzeeAPI();

  const { score, time, combiSimplesFinal, combiComplexesFinal } = useYahtzeeContext();

  const handleSave = async (): Promise<void> => {
    if (name === '' || name.length > 15) {
      alert('Name incorrect (too long or empty)');
      return;
    }
    try {
      const details = { simple: combiSimplesFinal, complexe: combiComplexesFinal };
      setSaving(true);
      await addScore(currentIcon, name, score, date, time, details);
    } catch (error) {
      console.error("Erreur: " + error);
    } finally {
      closeFunction();
    }
  };

  const onClickArrow = (left: boolean): void => {
    const currentIndex = iconsArray.indexOf(currentIcon);
    
    if (left) {
      if (currentIndex === 0) {
        setCurrentIcon(iconsArray[iconsArray.length - 1]);
      } else {
        setCurrentIcon(iconsArray[currentIndex - 1]);
      }
    } else if (!left) {
      if (currentIndex === iconsArray.length - 1) {
        setCurrentIcon(iconsArray[0]);
      } else {
        setCurrentIcon(iconsArray[currentIndex + 1]);
      }
    }
  };
  
  // 81eca0 (clair) / 48ce64 (normal) / 1e6d35

  return (
        openModal && openSaveModal && (
            <div className="saveContainer">
              <div className="saveBox">
                <h1 style={{fontWeight: 'bold'}}>save your score</h1>
                <h3>select an icon </h3>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                  <img src={currentLeftArrow} alt="left arrow" onClick={() => onClickArrow(true)} onMouseOver={() => {setCurrentLeftArrow('/utils/left_arrow_selected.png')}} onMouseLeave={() => {setCurrentLeftArrow('/utils/left_arrow.png')}} style={{ height: '30px', width: '46px', paddingRight: '5px' }} />
                  <img src={currentIcon} alt="score" style={{ height: '75px', width: '75px' }} />
                  <img src={currentRightArrow} alt="right arrow" onClick={() => onClickArrow(false)} onMouseOver={() => {setCurrentRightArrow('/utils/right_arrow_selected.png')}} onMouseLeave={() => {setCurrentRightArrow('/utils/right_arrow.png')}} style={{ height: '30px', width: '46px',  }} />
                </div>
                <div style={{textAlign: 'center', marginBottom: '15px', marginTop: '15px'}}>
                  <h3>enter your name</h3>
                  <input type="text" style={{marginTop: '15px'}} onChange={(e) => setName(e.target.value)} maxLength={11} required/>
                </div>
                <table className="scoreTableau" style={{ border: '1px solid lightgray', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{ backgroundColor: 'white', border: '1px solid lightgray' }}>
                      <th style={{fontWeight: 'bold', border: '1px solid lightgray'}}>icon</th>
                      <th style={{fontWeight: 'bold', border: '1px solid lightgray'}}>name</th>
                      <th style={{fontWeight: 'bold', border: '1px solid lightgray'}}>score</th>
                      <th style={{fontWeight: 'bold', border: '1px solid lightgray'}}>date</th>
                      <th style={{fontWeight: 'bold', border: '1px solid lightgray'}}>duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid lightgray', width: '10%', textAlign: 'left' }}>
                        <img src={currentIcon} alt="score" style={{ height: '25px', width: '25px' }} />
                      </td>
                      <td style={{ border: '1px solid lightgray', width: '50px', textAlign: 'center' }}>
                        <p>{name}</p>
                      </td>
                      <td style={{ border: '1px solid lightgray', width: '50px', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.2rem' }}>{score}</p>
                      </td>
                      <td style={{ border: '1px solid lightgray', width: '50px', textAlign: 'center' }}>
                        <p>{date}</p>
                      </td>
                      <td style={{ border: '1px solid lightgray', width: '50px', textAlign: 'center' }}>
                        <p>{formatTime(time)}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{display: 'flex', flexDirection: 'row', gap: '10px', paddingBottom: '10px'}}>
                  { saving ? <img src='/dices/nonumber.gif' style={{ height: '40px', width: '40px'}} /> : <button className="saveButton" onClick={handleSave}>save</button> }
                  <button className="fermerButton" onClick={closeFunction}>cancel</button>
                </div>
              </div>
            </div>
    )
  );
}
