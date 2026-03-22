import './ScoreSaving.css';
import { useEffect, useRef, useState } from 'react';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';
import funnyNames from '../../assets/utils/funny_names.json';
import { useTranslation } from '../../i18n/useTranslation';

type RulesProps = {
  closeFunction: () => void;
  openModal: boolean;
  openSaveModal: boolean;
};

type SaveState = 'saving' | 'personalizing' | 'updating' | 'saved' | 'error';

const randomFunnyName = () => funnyNames[Math.floor(Math.random() * funnyNames.length)];

export function ScoreSaving({ closeFunction, openModal, openSaveModal }: RulesProps) {

  const icons = import.meta.glob("/src/assets/icons/*.png", { eager: true });
  const iconsArray = Object.values(icons).map((icon: any) => icon.default);
  const { settings } = useYahtzeeContext();
  const { t } = useTranslation();

  const [currentIcon, setCurrentIcon] = useState<string>(iconsArray[0]);
  const [name, setName] = useState<string>(settings.defaultName);
  const [saveState, setSaveState] = useState<SaveState>('saving');
  const [scoreId, setScoreId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const hasSaved = useRef(false);

  const date = new Date().toLocaleDateString();
  const { addScore, updateScore, formatTime } = YahtzeeAPI();
  const { score, time, combiSimplesFinal, combiComplexesFinal, setIsSaved } = useYahtzeeContext();

  // Auto-save immediately when modal opens
  useEffect(() => {
    if (!openModal || !openSaveModal || hasSaved.current) return;
    hasSaved.current = true;
    const autoSave = async () => {
      try {
        const details = { simple: combiSimplesFinal, complexe: combiComplexesFinal };
        const id = await addScore(iconsArray[0], settings.defaultName || randomFunnyName(), score, time, details);
        setScoreId(id);
        setIsSaved(true);
        setSaveState('personalizing');
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveState('error');
        setErrorMsg('Auto-save failed. Please try again.');
      }
    };
    autoSave();
  }, [openModal, openSaveModal]);

  const handlePersonalize = async (): Promise<void> => {
    if (scoreId === null) return;
    const finalName = name.trim() === '' ? randomFunnyName() : name;
    if (finalName.length > 15) {
      setErrorMsg('Name must be 15 characters max.');
      return;
    }
    try {
      setErrorMsg(null);
      setSaveState('updating');
      await updateScore(scoreId, currentIcon, finalName);
      setSaveState('saved');
      setTimeout(() => { closeFunction(); }, 1800);
    } catch (error) {
      console.error("Update failed:", error);
      setSaveState('error');
      setErrorMsg('Update failed. Your score is saved but without customization.');
      setTimeout(() => { closeFunction(); }, 2500);
    }
  };

  const handleSkip = () => {
    closeFunction();
  };

  const onClickArrow = (left: boolean): void => {
    const currentIndex = iconsArray.indexOf(currentIcon);
    if (left) {
      setCurrentIcon(currentIndex === 0 ? iconsArray[iconsArray.length - 1] : iconsArray[currentIndex - 1]);
    } else {
      setCurrentIcon(currentIndex === iconsArray.length - 1 ? iconsArray[0] : iconsArray[currentIndex + 1]);
    }
  };

  const renderActions = () => {
    if (saveState === 'saving') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <img src='/dices/nonumber.gif' style={{ height: '40px', width: '40px' }} />
          <span style={{ fontSize: '0.65rem', color: '#5a8fa8', fontFamily: "'Press Start 2P', monospace" }}>saving...</span>
        </div>
      );
    }
    if (saveState === 'updating') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <img src='/dices/nonumber.gif' style={{ height: '40px', width: '40px' }} />
          <span style={{ fontSize: '0.65rem', color: '#5a8fa8', fontFamily: "'Press Start 2P', monospace" }}>updating...</span>
        </div>
      );
    }
    if (saveState === 'saved') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>✅</span>
          <span style={{ fontSize: '0.65rem', color: '#4caf6e', fontFamily: "'Press Start 2P', monospace" }}>{t.modals.score_saving["score_saved"]}</span>
        </div>
      );
    }
    if (saveState === 'personalizing') {
      return (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="saveButton" onClick={handlePersonalize}>{t.modals.score_saving["save"]}</button>
          <button className="saveButton saveButtonSecondary" onClick={handleSkip}>{t.modals.score_saving["skip"]}</button>
        </div>
      );
    }
    if (saveState === 'error') {
      return <button className="saveButton" onClick={handlePersonalize}>retry</button>;
    }
  };

  const isInteractive = saveState === 'personalizing' || saveState === 'error';

  return (
    openModal && openSaveModal && (
      <div className="saveContainer">
        <div className="saveBox" onClick={(e) => e.stopPropagation()}>

          {saveState === 'saving' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
              <img src='/dices/nonumber.gif' style={{ height: '60px', width: '60px' }} />
              <h1>{t.modals.score_saving["saving_score"]}</h1>
            </div>
          ) : (
            <>
              <h1>{saveState === 'saved' ? 'all done! ✅' : 'customize your entry'}</h1>
              {saveState === 'personalizing' && (
                <p style={{ fontSize: '0.75rem', color: '#5a8fa8', marginBottom: '0.5rem' }}>
                  {t.modals.score_saving["saving_score"]}
                </p>
              )}

              <div className="saveColumns">
                <div className="saveIconCol">
                  <h3>{t.modals.score_saving["select_icon"]}</h3>
                  <div className="saveIconPicker">
                    <button className="arrowBtn" onClick={() => onClickArrow(true)} disabled={!isInteractive}>
                      <img src='/utils/left_arrow.png' alt="left" style={{ height: '28px' }} />
                    </button>
                    <img className="icon" src={currentIcon} alt="icon" />
                    <button className="arrowBtn" onClick={() => onClickArrow(false)} disabled={!isInteractive}>
                      <img src='/utils/right_arrow.png' alt="right" style={{ height: '28px' }} />
                    </button>
                  </div>
                </div>

                <div className="saveNameCol">
                  <h3>{t.modals.score_saving["enter_name"]}</h3>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={11}
                    placeholder={t.modals.score_saving["name_placeholder"]}
                    disabled={!isInteractive}
                  />
                </div>
              </div>

              <table className="scoreTableau">
                <thead>
                  <tr>
                    <th>{t.modals.score_saving["icon"]}</th>
                    <th>{t.modals.score_saving["name"]}</th>
                    <th>{t.modals.score_saving["score"]}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><img src={currentIcon} alt="score" style={{ height: '24px', width: '24px' }} /></td>
                    <td>{name || '???'}</td>
                    <td style={{ fontSize: '1rem', fontWeight: 800, color: '#7a9bb5' }}>{score}</td>
                    <td>{date}</td>
                    <td>{formatTime(time)}</td>
                  </tr>
                </tbody>
              </table>

              {errorMsg && <p className="saveError">{errorMsg}</p>}
            </>
          )}

          <div className="saveActions">
            {renderActions()}
          </div>
        </div>
      </div>
    )
  );
}