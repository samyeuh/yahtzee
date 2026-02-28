import { useEffect, useState } from 'react';
import './Rules.css';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext';

type RulesProps = {
  closeFunction: () => void;
  openModal: boolean;
  openRuleModal: boolean;
};

export function Rules({ closeFunction, openModal, openRuleModal }: RulesProps) {

  const initialSRC = Array(5).fill("/dices/nonumber.png");
  const gifSRC     = Array(5).fill("/dices/nonumber.gif");
  const [dicesSRC, setDicesSRC] = useState(initialSRC);
  const { defaultCombiComplexes, setDefaultCombiComplexes, defaultCombiSimples, yahtzeeLogic } = useYahtzeeContext();

  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleRoll = async () => {
    setDicesSRC(gifSRC);
    await new Promise(r => setTimeout(r, 1000));
    setDicesSRC(dicesSRC.map(() => "/dices/dice" + randomInt(1, 6) + ".png"));
  };

  const handleToolTip = async () => {
    try {
      const tooltip = yahtzeeLogic.getToolTipDice();
      setDefaultCombiComplexes(defaultCombiComplexes.map((combi) => {
        const map: Record<string, string[]> = {
          'three of a kind': tooltip.threeOfAKind,
          'four of a kind': tooltip.fourOfAKind,
          'full house': tooltip.fullHouse,
          'small straight': tooltip.smallStraight,
          'large straight': tooltip.largeStraight,
          'yahtzee': tooltip.yahtzee,
          'chance': tooltip.chance,
        };
        return map[combi.nom] ? { ...combi, hoverDices: map[combi.nom] } : combi;
      }));
    } catch (error) {
      console.error("error" + error);
    }
  };

  useEffect(() => { handleToolTip(); }, []);

  if (!openModal || !openRuleModal) return null;

  return (
    <div className="rulesContainer">
      <div className="rulesBox">

        {/* ── Contenu scrollable ── */}
        <div className="rulesContent">

          {/* Header */}
          <img src="/dices/nonumber.gif" className='gif' style={{ width: '60px', height: '60px' }} alt="dice gif" />
          <h1>rules</h1>
          <p>welcome to the best web adaptation of <strong>yahtzee 🎲</strong></p>

          <div className="rulesDivider" />

          {/* Dés */}
          <p>you have <strong>5 dices</strong> — click to roll them !</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className='rollButton' onClick={handleRoll}>Roll</button>
            <div className="dicesRow">
              {dicesSRC.map((src, i) => <img key={i} src={src} alt="dice" className="fakeDice" />)}
            </div>
          </div>

          <div className="rulesDivider" />

          {/* Combos */}
          <p>your goal is to make <strong>combinations</strong> with your dices :</p>
          <div className="tableau">
            <table className="rulesTable">
              <thead>
                <tr><th>combo</th><th>description</th><th>example</th></tr>
              </thead>
              <tbody>
                {defaultCombiComplexes.map((ligne, i) => (
                  <tr key={i}>
                    <td><strong>{ligne.nom}</strong></td>
                    <td>{ligne.hover}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {ligne.hoverDices.map((url, j) => (
                        <img key={j} src={url} alt="dice" style={{ width: '18px', height: '18px' }} />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="rulesTable">
              <thead>
                <tr><th>combo</th><th>description</th><th>example</th></tr>
              </thead>
              <tbody>
                {defaultCombiSimples.map((ligne, i) => (
                  <tr key={i}>
                    <td><strong>{ligne.nom}</strong></td>
                    <td>{ligne.hover}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {ligne.hoverDices.map((url, j) => (
                        <img key={j} src={url} alt="dice" style={{ width: '18px', height: '18px' }} />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rulesDivider" />

          {/* Tips */}
          <div className="rulesTip">
            🎯 you can roll up to <strong>3 times</strong> per round
          </div>
          <div className="rulesTip">
            🔒 click a dice to <strong>keep it</strong> before rolling again
          </div>
          <div className="rulesTip">
            ✨ <strong>good luck !</strong>
          </div>

        </div>

        {/* ── Footer sticky avec bouton play ── */}
        <div className="rulesFooter">
          <span className="rulesFooterHint">ready to play ?</span>
          <button className="closeButton" onClick={closeFunction}>▶ play</button>
        </div>

      </div>
    </div>
  );
}