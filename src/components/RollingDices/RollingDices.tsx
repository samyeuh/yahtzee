    import { useEffect, useState } from 'react';
    import './RollingDices.css';
    import { RollingDicesAPI } from './RollingDicesAPI';
    import { useGameplayContext } from '../../context/GameplayContext/GameplayContext'

    type RollingDicesProps = {
        openRules: () => void;
    }; 

    export function RollingDices({ openRules }: RollingDicesProps) {
        const initialSRC = ["/nonumber.gif", "/nonumber.gif", "/nonumber.gif", "/nonumber.gif", "/nonumber.gif"];
        const gifSRC = ["/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif"];
        const [dicesSRC, setDicesSRC] = useState(initialSRC);
        const [nbTurns, setNbTurns] = useState(3);
        const [dicesKeep, setDicesKeep] = useState<number[]>([]);
        const[isRollDisabled, setRollDisabled] = useState(false);
        const { rollDices, keepDices, calculateScores, initRound } = RollingDicesAPI();
        const { roundActive, setRoundActive } = useGameplayContext();

        // TODO: if yams confettis ?

        useEffect(() => {
            if (roundActive == true) {
                setRollDisabled(false);
                setDicesSRC(initialSRC);
                setDicesKeep([]);
                setNbTurns(3);
                initRound();
            }
        }, [roundActive]);

        useEffect(() => {
            handleKeepDice();
            if (dicesKeep.length === 5) {
                setNbTurns(0);
            }
        }, [dicesKeep]);

        useEffect(() => {
            if (nbTurns <= 0){
                endOfRound();
            }
        }, [nbTurns]);

        // const handleKeyDown = (event:KeyboardEvent) => {
        //     if (event.code === 'Space'){
        //         event.preventDefault();
        //         if (!isRollDisabled) {
        //             handleRoll();
        //         }
                
        //     };
        // };

        // useEffect(() => {
        //     document.addEventListener('keydown', handleKeyDown);
        //     return () => {
        //         document.removeEventListener('keydown', handleKeyDown);
        //     }
        // }, []);
        
        function delay(ms: number) {
            return new Promise( resolve => setTimeout(resolve, ms) );
        }

        const handleRoll = async (): Promise<void> => {
            if (isRollDisabled){
                console.error("Not now !!");
                return;
            }
            let diceSRCList = [...dicesSRC];
            let index = [];
            for (let i = 0; i < 5; i++) {
                if (!dicesKeep.includes(i)) {
                    diceSRCList[i] = gifSRC[i];
                } else {
                    index.push(i);
                }
            }
            setDicesSRC(diceSRCList);
            await delay(1000);
        
            try {
                let result = await rollDices();
                let diceList = result.dices.map((dice: number) => "/dices/dice" + dice + ".png");
                for (let i = 0; i < diceList.length; i++) {
                    if (index.includes(i)) {
                        diceList[i] = diceSRCList[i];
                    }else{
                        diceList[index[i]] = "/dices/dice" + diceList[i] + ".png";
                    }
                }
                setDicesSRC(diceList);
                setNbTurns(parseInt(result.nbTurns));
                if (nbTurns <= 1) {
                    setRollDisabled(true);
                    endOfRound();
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        const handleDiceClick = async (index: number): Promise<void> => {
            if (dicesSRC.includes("/dice.gif") || dicesSRC.includes("/nonumber.gif")) {
                return;
            }
            if (dicesKeep.includes(index)) {
                const newDiceList = dicesKeep.filter(value => value !== index);
                const diceSRCList = [...dicesSRC];
                diceSRCList[index] = diceSRCList[index].replace("_select.png",".png");
                setDicesKeep(newDiceList);
                setDicesSRC(diceSRCList);
            } else {
                const newDiceList = [...dicesKeep, index];
                const diceSRCList = [...dicesSRC];
                diceSRCList[index] = diceSRCList[index].replace(".png","_select.png");
                setDicesKeep(newDiceList);
                setDicesSRC(diceSRCList);
            }
        };
        

        const handleKeepDice = async (): Promise<void> => {
            try {
                await keepDices(dicesKeep);
            } catch (error) {
                console.error("Error: ", error);
            }
        }

        const endOfRound = async (): Promise<void> => {
            try {
                await calculateScores();
                setRoundActive(false);
                setRollDisabled(true);
            } catch (error) {
                console.error("Error: ", error);
            }
        }

        return (
            <>
            <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row', position: 'absolute', right: 100}}>
                    <img key="rules" alt="rules" src="nonumber.gif" style={{height: '50px', width: '50px'}} onClick={openRules} />
                </div> 
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h1 style={{fontWeight: 'bold'}}> your dices </h1>
                        <p>remaining rolls: {nbTurns}</p>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width:'70%', padding: '10px'}}>
                                {dicesSRC.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt="dice"
                                        className="dice"
                                        onClick={() => handleDiceClick(index)}
                                    />
                                ))}
                            </div>
                        <button className="button" onClick={handleRoll} disabled={isRollDisabled}>ROLL</button>
                    </div>
                </div>
            </div>
            </>
        );
    }
