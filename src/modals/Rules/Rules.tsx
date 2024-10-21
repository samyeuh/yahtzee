  import { useEffect, useState } from 'react';
import './Rules.css'
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import { CombinationsAPI } from '../../components/Combinations/CombinationsAPI';
  type RulesProps = {
    closeFunction: () => void;
    openModal: boolean;
  };
  
  export function Rules({closeFunction, openModal}: RulesProps) {

    const initialSRC = ["/nonumber.gif", "/nonumber.gif", "/nonumber.gif", "/nonumber.gif", "/nonumber.gif"];
    const gifSRC = ["/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif"];
    const [dicesSRC, setDicesSRC] = useState(initialSRC);
    const { defaultCombiComplexes, setDefaultCombiComplexes, defaultCombiSimples } = useGameplayContext();
    const { getTooltipDices } = CombinationsAPI();

    function randomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }
    
    const handleRoll = async (): Promise<void> => {
      setDicesSRC(gifSRC);
      await delay(1000);
      let diceList = dicesSRC.map(() => {
          return "/dices/dice" + randomInt(1, 6) + ".png";
      });
      setDicesSRC(diceList);
    }

    const handleToolTip = async (): Promise<void> => {
      try {
        const tooltip = await getTooltipDices();
        var combiComplexeCopy = defaultCombiComplexes;
        const updatedCombiComplexes = combiComplexeCopy.map((combi) => {
            switch (combi.nom){
                case 'three of a kind':
                    return {...combi, hoverDices: tooltip.threeOfAKind};
                case 'four of a kind':
                    return {...combi, hoverDices: tooltip.fourOfAKind};
                case 'full house':
                    return {...combi, hoverDices: tooltip.fullHouse};
                case 'small straight':
                    return {...combi, hoverDices: tooltip.smallStraight};
                case 'large straight':
                    return {...combi, hoverDices: tooltip.largeStraight};
                case 'yahtzee':
                    return {...combi, hoverDices: tooltip.yahtzee};
                case 'chance':
                    return {...combi, hoverDices: tooltip.chance};
                default:
                    return combi;
            }
        });
        setDefaultCombiComplexes(updatedCombiComplexes)
        } catch (error) {
          console.error("error" + error);
        }
      }
      
      useEffect(() => {
        handleToolTip();
      }, [])
      
      return (
        (openModal &&
        <div className="rulesContainer">
            <div className="rulesBox">
          <h1 style={{fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white'}}> rules !! </h1>
          <p style={{ textAlign: 'center', backgroundColor: 'white'}}> welcome in the best web adaption of the yahtzee ☺</p>
          <img src="dice.gif" style={{maxWidth: '80px', maxHeight: '80px', backgroundColor: 'white'}}></img> {/* to center */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <p style={{backgroundColor: 'white'}}> in front of you, you have five dice that you can </p>
              <button className='rollButton' onClick={handleRoll}> Roll </button>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '10px'}}>
              {dicesSRC.map((src, index) => (
                <img key={index} src={src} alt="dice" className="fakeDice"/>
              ))}
            </div>
            <p> your objective in the round is to create a combination with dice</p>
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px', marginTop: '10px', marginBottom: '15px'}}>
              <table style={{border: '1px solid lightgray', borderCollapse: 'collapse'}}>
                <tbody>
                  {defaultCombiSimples.map((ligne, index) => {
                    const isTotalRow = ligne.nom == "total score";
                    return (
                      <tr key={isTotalRow ? 'total' : index} style={isTotalRow ? {background: 'linear-gradient(to bottom, white, lightblue)'} : {backgroundColor: 'white'}}>
                        <td style={{fontWeight: 'bold', border: '1px solid lightgray'}}>
                          {ligne.nom}
                        </td>
                        <td style={{border: '1px solid lightgray'}}>
                          {ligne.hover}
                        </td>
                        <td style={{border: '1px solid lightgray'}}>
                          {ligne.hoverDices.map((url, index) => (
                            <img key={index} src={url} alt="dice" className="fakeDice" style={{width: '20px', height: '20px'}}/>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table>
                <tbody>
                {defaultCombiComplexes.map((ligne, index) => {
                    const isTotalRow = ligne.nom == "total score";
                    return (
                      <tr key={isTotalRow ? 'total' : index} style={isTotalRow ? {background: 'linear-gradient(to bottom, white, lightblue)'} : {backgroundColor: 'white'}}>
                        <td style={{fontWeight: 'bold', border: '1px solid lightgray'}}>
                          {ligne.nom}
                        </td>
                        <td style={{border: '1px solid lightgray'}}>
                          {ligne.hover}
                        </td>
                        <td style={{border: '1px solid lightgray'}}>
                          {ligne.hoverDices.map((url, index) => (
                            <img key={index} src={url} alt="dice" className="fakeDice" style={{width: '20px', height: '20px'}}/>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{display: 'flex', flexDirection:'row', justifyContent: 'center', gap: '5px'}}>
              <p> during each round, you can roll your dices only</p>
              <p style={{fontWeight: 'bold'}}> three </p>
              <p> times</p>
            </div>
            <p> for help you to create a combination with your dice, you can keep some dice before roll with clicking on it !!</p>
            <p style={{fontWeight: 'bold'}}> good luck now :p</p>
          </div>
          <button className="closeButton" onClick={closeFunction} style={{marginTop: "10px"}}> Fermer </button>
        </div>
        </div>
        )
      );
    }
    