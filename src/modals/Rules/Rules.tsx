import { useEffect, useState } from 'react';
import './Rules.css';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';

type RulesProps = {
  closeFunction: () => void;
  openModal: boolean;
};

export function Rules({ closeFunction, openModal }: RulesProps) {
  const initializeUser = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  };

  const initialSRC = ["/nonumber.png", "/nonumber.png", "/nonumber.png", "/nonumber.png", "/nonumber.png"];
  const gifSRC = ["/nonumber.gif", "/nonumber.gif", "/nonumber.gif", "/nonumber.gif", "/nonumber.gif"];
  const [dicesSRC, setDicesSRC] = useState(initialSRC);
  const { defaultCombiComplexes, setDefaultCombiComplexes, defaultCombiSimples } = useGameplayContext();
  const { getTooltipDices } = YahtzeeAPI(initializeUser());

  function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleRoll = async (): Promise<void> => {
    setDicesSRC(gifSRC);
    await delay(1000);
    let diceList = dicesSRC.map(() => {
      return "/dices/dice" + randomInt(1, 6) + ".png";
    });
    setDicesSRC(diceList);
  };

  const handleToolTip = async (): Promise<void> => {
    try {
      const tooltip = await getTooltipDices();
      var combiComplexeCopy = defaultCombiComplexes;
      const updatedCombiComplexes = combiComplexeCopy.map((combi) => {
        switch (combi.nom) {
          case 'three of a kind':
            return { ...combi, hoverDices: tooltip.threeOfAKind };
          case 'four of a kind':
            return { ...combi, hoverDices: tooltip.fourOfAKind };
          case 'full house':
            return { ...combi, hoverDices: tooltip.fullHouse };
          case 'small straight':
            return { ...combi, hoverDices: tooltip.smallStraight };
          case 'large straight':
            return { ...combi, hoverDices: tooltip.largeStraight };
          case 'yahtzee':
            return { ...combi, hoverDices: tooltip.yahtzee };
          case 'chance':
            return { ...combi, hoverDices: tooltip.chance };
          default:
            return combi;
        }
      });
      setDefaultCombiComplexes(updatedCombiComplexes);
    } catch (error) {
      console.error("error" + error);
    }
  };

  useEffect(() => {
    handleToolTip();
  }, []);

  return (
    openModal && (
      <div className="rulesContainer">
        <div className="rulesBox">
          <h1 style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>rules</h1>
          <p style={{ textAlign: 'center', backgroundColor: 'white' }}>welcome to the best web adaptation of </p> <p style={{fontWeight: 'bold'}}> yahtzee :D</p>
          <img src="nonumber.gif" className='gif' style={{ maxWidth: '80px', maxHeight: '80px', backgroundColor: 'white' }} alt="GIF" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <p style={{ backgroundColor: 'white' }}>in front of you, you have five dice that you can</p>
              <button className='rollButton' onClick={handleRoll}>Roll</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
              {dicesSRC.map((src, index) => (
                <img key={index} src={src} alt="dice" className="fakeDice" />
              ))}
            </div>
            <p>your objective in the round is to create a combination with dice</p>
            <div className='tableau'>
              <table style={{ border: '1px solid lightgray', borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {defaultCombiComplexes.map((ligne, index) => {
                    const isTotalRow = ligne.nom === "total score";
                    return (
                      <tr key={isTotalRow ? 'total' : index} style={isTotalRow ? { background: 'linear-gradient(to bottom, white, lightblue)' } : { backgroundColor: 'white' }}>
                        <td style={{ fontWeight: 'bold', border: '1px solid lightgray' }}>
                          {ligne.nom}
                        </td>
                        <td style={{ border: '1px solid lightgray' }}>
                          {ligne.hover}
                        </td>
                        <td style={{ border: '1px solid lightgray' }}>
                          {ligne.hoverDices.map((url, index) => (
                            <img key={index} src={url} alt="dice" className="fakeDice" style={{ width: '20px', height: '20px' }} />
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table style={{ border: '1px solid lightgray', borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {defaultCombiSimples.map((ligne, index) => {
                    const isTotalRow = ligne.nom === "total score";
                    return (
                      <tr key={isTotalRow ? 'total' : index} style={isTotalRow ? { background: 'linear-gradient(to bottom, white, lightblue)' } : { backgroundColor: 'white' }}>
                        <td style={{ fontWeight: 'bold', border: '1px solid lightgray' }}>
                          {ligne.nom}
                        </td>
                        <td style={{ border: '1px solid lightgray' }}>
                          {ligne.hover}
                        </td>
                        <td style={{ border: '1px solid lightgray' }}>
                          {ligne.hoverDices.map((url, index) => (
                            <img key={index} src={url} alt="dice" className="fakeDice" style={{ width: '20px', height: '20px' }} />
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
              <p>during each round, you can roll your dice only</p>
              <p style={{ fontWeight: 'bold' }}>three</p>
              <p>times</p>
            </div>
            <p>to help you create a combination with your dice, you can keep some dice before rolling by clicking on it !!</p>
            <p style={{ fontWeight: 'bold' }}>good luck now :p</p>
          </div>
          <button className="closeButton" onClick={closeFunction} style={{ marginTop: "10px" }}>play</button>
        </div>
      </div>
    )
  );
}
