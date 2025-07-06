import { useEffect, useState } from 'react';
import './EndRolling.css';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext'
import { YahtzeeAPI } from '../../api/YahtzeeAPI';

type EndRollingProps = {
    openScoreSaving: () => void;
    openRules: () => void;
    handleReplay: () => void;
}; 

export function EndRolling({ openScoreSaving, openRules, handleReplay }: EndRollingProps) {
    const initialSRC = ["/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif"];
    const [dicesSRC, setDicesSRC] = useState<string[]>(["/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif", "/dices/nonumber.gif"]);
    const {score, time} = useYahtzeeContext();
    const { formatTime } = YahtzeeAPI();
    const [isSaved, setIsSaved] = useState<boolean>(false);

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
            "/score/heart.png",
            `/score/dice${digits[0]}.png`,
            `/score/dice${digits[1]}.png`,
            `/score/dice${digits[2]}.png`,
            "/score/heart.png"
        ];

        for(var i = 0; i < tempList.length; i++){
            await delay(1000);
            tempList[i] = resultList[i];
            setDicesSRC([...tempList])
        }

        return tempList;
    };

    const handleOnSave = () => {
        openScoreSaving();
        setIsSaved(true);
    }

    return (
        <>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className='gif-rules'>
                <img key="rules" alt="rules" src="/dices/rules.png" style={{height: '50px', width: '50px'}} onClick={openRules} />
            </div> 
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h1 style={{fontWeight: 'bold'}}> your score </h1>
                    <p>thanks for playing ♥ {formatTime(time)}</p>
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
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '15px'}}>
                        <button className="button" onClick={handleReplay}>PLAY AGAIN</button>
                        <button className="button" onClick={handleOnSave} disabled={isSaved}>SAVE MY SCORE</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
