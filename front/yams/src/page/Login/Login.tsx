import CSS from 'csstype';
import { ChangeEvent, useEffect, useState } from 'react';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import { useNavigate } from 'react-router-dom';
import { EndpageAPI } from '../Endpage/EndpageAPI';

export function Login() {
    const { setRoundActive, setGameActive, playerName, setPlayerName, setScore } = useGameplayContext();
    const { restartGame } = EndpageAPI();
    const navigate = useNavigate();

    const imageStyle: CSS.Properties = {}
    const [ errorMessage, setErrorMessage ] = useState<boolean>(true);

    useEffect(() => {
      onLoad();
  }, []);
  
    const onLoad = async () => {
      try {
          await restartGame();
          setPlayerName("");
          setScore(0);
      } catch (error) {
          console.error("Erreur: " + error);
      }
    }

    const startGame = (): void => {
        if (!checkPseudo()){
            setErrorMessage(false);
        } else {
            setErrorMessage(true);
            setGameActive(true);
            setRoundActive(true);
            navigate('/play')
        }
    };

    const checkPseudo = (): boolean => {
        if (playerName === ""){
            return false;
        } else if (playerName.length >= 32) {
            return false;
        }
        return true;
    }

    return(
        <div style={{gap: '10px'}}>
            <div>
                <h1>YAM'S DE SAMY</h1>
                <div style={{gap: '-5px'}}>
                    <img src="../dice.gif" style={imageStyle} alt="dice"/>
                    <img src="../dice.gif" style={imageStyle} alt="dice"/>
                    <img src="../dice.gif" style={imageStyle} alt="dice"/>
                </div>
            </div>
            <p>Entrez un nom (32 charactères max): </p>
            <div style={{justifyContent: 'center', display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column', width: '30%', gap:'10px'}}>
                    <input name="playerName" type="text" placeholder="Ex: samyrtille" onChange={(i: ChangeEvent<HTMLInputElement>) => {setPlayerName(i.target.value)}}/>
                    <button onClick={startGame}> JOUER !!!! </button>
                    <p style={{backgroundColor: 'red'}} hidden={errorMessage}>Merci d'entrer un pseudo correct</p>
                </div>
            </div>
        </div>
    )



}