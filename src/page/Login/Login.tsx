import './Login.css'
import { ChangeEvent, useEffect, useState } from 'react';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import { useNavigate } from 'react-router-dom';
import { EndpageAPI } from '../Endpage/EndpageAPI';

export function Login() {
    // TODO: button & textarea 

    const { setRoundActive, setGameActive, playerName, setPlayerName, setScore } = useGameplayContext();
    const { restartGame } = EndpageAPI();
    const navigate = useNavigate();
    const [ errorMessage, setErrorMessage ] = useState<boolean>(true);
    const noIncludes: string[] = ["<", ">", "/"];


    useEffect(() => {
      whenLoading();
    }, []);


    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
  
    const whenLoading = async () => {
      try {
          await restartGame();
          setPlayerName("");
          setScore(0);
      } catch (error) {
          console.error("Erreur: " + error);
      }
    }

    const startGame = async (): Promise<void> => {
        if (!checkPseudo()){
            setErrorMessage(false);
            await delay(3000);
            setErrorMessage(true);
        } else {
            setErrorMessage(true);
            setGameActive(true);
            setRoundActive(true);
            navigate('/play');
        }
    };

    const checkPseudo = (): boolean => {
        if (playerName === ""){
            return false;
        } else if (playerName.length >= 32) {
            return false;
        } else {
            for (const i of noIncludes){
                if (playerName.includes(i)){
                    return false;
                }
            }
        }
        return true;
    }

    return(
        <>  
            <div className="fullpage">
                <div className="title">
                    <h1>yams</h1>
                </div>
                <div>
                    {/*<p>Entrez un nom (32 charactères max): </p>*/}
                    <div style={{display: 'flex', justifyContent: 'center',}}>
                        <div className="form">
                            <input name="playerName" type="text" placeholder="Ex: samyrtille" onChange={(i: ChangeEvent<HTMLInputElement>) => {setPlayerName(i.target.value)}}/>
                            <button className="buttons" onClick={startGame}> JOUER !!!! </button>
                            <p className="errorMessage" hidden={errorMessage}>Merci d'entrer un pseudo correct</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}