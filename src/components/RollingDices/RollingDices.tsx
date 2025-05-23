import { useEffect, useState } from 'react';
import './RollingDices.css';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext'

type RollingDicesProps = {
    openRules: () => void;
};

export function RollingDices({ openRules }: RollingDicesProps) {
    const initialSRC = ["/dices/nonumber.png", "/dices/nonumber.png", "/dices/nonumber.png", "/dices/nonumber.png", "/dices/nonumber.png"];
    const gifSRC = ["/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif"];
    const [dicesSRC, setDicesSRC] = useState(initialSRC);
    const [nbTurns, setNbTurns] = useState(3);
    const [dicesKeep, setDicesKeep] = useState<number[]>([]);
    const[isRollDisabled, setRollDisabled] = useState(false);
    const[isFirstRoll, setIsFirstRoll] = useState(true);
    const { roundActive, setRoundActive, yahtzeeLogic } = useYahtzeeContext();

    // TODO: if yams confettis ?

    useEffect(() => {
        if (roundActive == true) {
            setRollDisabled(false);
            setDicesSRC(initialSRC);
            setDicesKeep([]);
            setNbTurns(3);
            yahtzeeLogic.initRound();
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

        if (isFirstRoll) {
            setIsFirstRoll(false);
            
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
        setRollDisabled(true);
        setDicesSRC(diceSRCList);
        await delay(1000);
    
        try {
            let result = yahtzeeLogic.rollDice();
            let diceList = result.dice.map((dice: number) => "/dices/dice" + dice + ".png");
            for (let i = 0; i < diceList.length; i++) {
                if (index.includes(i)) {
                    diceList[i] = diceSRCList[i];
                }else{
                    diceList[index[i]] = "/dices/dice" + diceList[i] + ".png";
                }
            }
            setDicesSRC(diceList);
            setNbTurns(result.nbTurn);
            setRollDisabled(false);
            if (nbTurns <= 1) {
                setRollDisabled(true);
                endOfRound();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleDiceClick = async (index: number): Promise<void> => {
        if (dicesSRC.includes("/dices/nonumber.gif") || dicesSRC.includes("/dices/nonumber.png")) {
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
            yahtzeeLogic.keepDice(dicesKeep);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const endOfRound = async (): Promise<void> => {
        try {
            yahtzeeLogic.calculateScore();
            setRoundActive(false);
            setRollDisabled(true);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    return (
        <>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className='gif-rules'>
                <img key="rules" alt="rules" src="/dices/rules.png" style={{height: '50px', width: '50px'}} onClick={openRules} />
            </div> 
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h1 style={{fontWeight: 'bold'}}> your dices </h1>
                    <p>remaining rolls: {nbTurns} • 00:00:000</p>
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
