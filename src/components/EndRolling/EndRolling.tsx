import { useEffect, useState } from 'react';
import './EndRolling.css';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext'

type EndRollingProps = {
    openRules: () => void;
    handleReplay: () => void;
}; 

// TODO: AFFICHER LE SCORE CORRECTEMENT DERNIERE ETAPE

export function EndRolling({ openRules, handleReplay }: EndRollingProps) {
    const initialSRC = ["/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif"];
    const [dicesSRC, setDicesSRC] = useState<string[]>(["/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif", "/dice.gif"]);
    const {score} = useGameplayContext();

    useEffect(() => {
        const updateDicesSRC = async () => {
            setDicesSRC(await displayScore(score));
        };
        updateDicesSRC();
    }, [score]);

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    const displayScore = async (score: number): Promise<string[]> => {
        var tempList = [...initialSRC];
        let digits = score.toString().padStart(3, '0').split('');
        let resultList = [
            "/dice.png",
            `/dice${digits[0]}.jpg`,
            `/dice${digits[1]}.jpg`,
            `/dice${digits[2]}.jpg`,
            "/dice.png"
        ];

        // faire un arbre pour clean

        for(var i = 0; i < tempList.length; i++){
            await delay(1000);
            tempList[i] = resultList[i];
            setDicesSRC([...tempList])
        }

        return tempList;
    };

    return (
        <>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row', position: 'absolute', right: 100}}>
        <img key="rules" alt="rules" src="dice.png" style={{height: '50px', width: '50px'}} onClick={openRules} />
        </div> 
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h1 style={{fontWeight: 'bold'}}> your score </h1>
                    <p>thanks for playing ♥</p>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width:'70%', padding: '10px'}}>
                            {dicesSRC.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt="dice"
                                    className="dice"
                                />
                            ))}
                        </div>
                    <button className="button" onClick={handleReplay}>REPLAY</button>
                </div>
            </div>
        </div>
        </>
    );
}
