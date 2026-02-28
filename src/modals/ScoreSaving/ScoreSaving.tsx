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
  const [saving, setSaving] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const date = new Date().toLocaleDateString();
  const { addScore, formatTime } = YahtzeeAPI();
  const { score, time, combiSimplesFinal, combiComplexesFinal, setIsSaved } = useYahtzeeContext();

  const handleSave = async (): Promise<void> => {
    if (name === '' || name.length > 15) {
      setErrorMsg('Name must be between 1 and 15 characters.');
      return;
    }
    try {
      setErrorMsg(null);
      const details = { simple: combiSimplesFinal, complexe: combiComplexesFinal };
      setSaving(true);
      await addScore(currentIcon, name, score, time, details);
      closeFunction();
      setIsSaved(true);
    } catch (error) {
      console.error("Erreur: " + error);
      setSaving(false);
      setErrorMsg('Something went wrong, please try again.');
    }
  };

  const onClickArrow = (left: boolean): void => {
    const currentIndex = iconsArray.indexOf(currentIcon);
    if (left) {
      setCurrentIcon(currentIndex === 0 ? iconsArray[iconsArray.length - 1] : iconsArray[currentIndex - 1]);
    } else {
      setCurrentIcon(currentIndex === iconsArray.length - 1 ? iconsArray[0] : iconsArray[currentIndex + 1]);
    }
  };

  return (
    openModal && openSaveModal && (
      <div className="saveContainer" onClick={closeFunction}>
        <div className="saveBox" onClick={(e) => e.stopPropagation()}>
          <h1>save your score</h1>

          {/* ── Deux colonnes ── */}
          <div className="saveColumns">

            {/* Colonne gauche : icône */}
            <div className="saveIconCol">
              <h3>select an icon</h3>
              <div className="saveIconPicker">
                <button className="arrowBtn" onClick={() => onClickArrow(true)}>
                  <img src='/utils/left_arrow.png' alt="left" style={{ height: '28px' }} />
                </button>
                <img className="icon" src={currentIcon} alt="icon" />
                <button className="arrowBtn" onClick={() => onClickArrow(false)}>
                  <img src='/utils/right_arrow.png' alt="right" style={{ height: '28px' }} />
                </button>
              </div>
            </div>

            {/* Colonne droite : nom */}
            <div className="saveNameCol">
              <h3>enter your name</h3>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                maxLength={11}
                required
                placeholder="your name..."
              />
            </div>

          </div>

          {/* ── Preview ── */}
          <table className="scoreTableau">
            <thead>
              <tr>
                <th>icon</th>
                <th>name</th>
                <th>score</th>
                <th>date</th>
                <th>duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><img src={currentIcon} alt="score" style={{ height: '24px', width: '24px' }} /></td>
                <td>{name}</td>
                <td style={{ fontSize: '1rem', fontWeight: 800, color: '#7a9bb5' }}>{score}</td>
                <td>{date}</td>
                <td>{formatTime(time)}</td>
              </tr>
            </tbody>
          </table>

          {/* ── Erreur ── */}
          {errorMsg && <p className="saveError">{errorMsg}</p>}

          {/* ── Actions ── */}
          <div className="saveActions">
            {saving
              ? <img src='/dices/nonumber.gif' style={{ height: '40px', width: '40px', margin: '0 auto' }} />
              : <button className="saveButton" onClick={handleSave}>save</button>
            }
          </div>

        </div>
      </div>
    )
  );
}