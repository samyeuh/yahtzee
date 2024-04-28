import { useEffect, useState } from 'react';
import './RollingDices.css';
import { RollingDicesAPI } from './RollingDicesAPI';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext'

export function RollingDices() {
    const initialSRC = ["/dice.png", "/dice.png", "/dice.png", "/dice.png", "/dice.png"];
    const gifSRC = ["/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif"];
    const [dicesSRC, setDicesSRC] = useState(initialSRC);
    const [nbTurns, setNbTurns] = useState(3);
    const [dicesKeep, setDicesKeep] = useState<number[]>([]);
    const[isRollDisabled, setRollDisabled] = useState(false);
    const { rollDices, keepDices, calculateScores, initRound } = RollingDicesAPI();
    const { roundActive, setRoundActive, playerName, score } = useGameplayContext();

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
    
    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    const handleRoll = async (): Promise<void> => {
        let diceSRCList = [...dicesSRC];
        let index = [];
        for (let i = 0; i < 5; i++) {
            if (!dicesKeep.includes(i)) {
                diceSRCList[i] = gifSRC[i];
            } else {
                index.push(i);
            }
        }
        console.log(diceSRCList);
        setDicesSRC(diceSRCList);
        await delay(1000);
    
        try {
            let result = await rollDices();
            let diceList = result.dices.map((dice: number) => "/dice" + dice + ".jpg");
            for (let i = 0; i < diceList.length; i++) {
                if (index.includes(i)) {
                    diceList[i] = diceSRCList[i];
                }else{
                    diceList[index[i]] = "/dice" + diceList[i] + ".jpg";
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
        if (dicesSRC.includes("/dice.gif") || dicesSRC.includes("/dice.png")) {
            return;
        }
        if (dicesKeep.includes(index)) {
            const newDiceList = dicesKeep.filter(value => value !== index);
            const diceSRCList = [...dicesSRC];
            diceSRCList[index] = diceSRCList[index].replace("_select.jpg",".jpg");
            setDicesKeep(newDiceList);
            setDicesSRC(diceSRCList);
        } else {
            const newDiceList = [...dicesKeep, index];
            const diceSRCList = [...dicesSRC];
            diceSRCList[index] = diceSRCList[index].replace(".jpg","_select.jpg");
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
            <div style={{ alignItems: 'center' }}>
                <h1> Vos dés </h1>
                <div>
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
                <button onClick={handleRoll} disabled={isRollDisabled}>
                    Roll
                </button>
                <p>Nombre de lancés restant: {nbTurns}</p>
                <p> Mon nom : {playerName}</p>
                <p> Mon score : {score}</p>
            </div>
        </>
    );
}
