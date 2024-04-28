import { Link, useNavigate } from 'react-router-dom';
import { EndpageAPI } from './EndpageAPI';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import { useEffect } from 'react';

export function Endpage() {

    const navigate = useNavigate();
    
    const { restartGame } = EndpageAPI();
    const { score, playerName, setPlayerName, setScore } = useGameplayContext();

    useEffect(() => {
        if (playerName === ""){
          navigate('/');
        }
      }, []);


    const handleClick = async () => {
        try {
            await restartGame();
            setPlayerName("");
            setScore(0);
        } catch (error) {
            console.error("Erreur :", error);
        }
    }


    return(
        <>
            <h2> Merci d'avoir joué {playerName} ! ☻</h2>
            <p> Votre score : <b>{score}</b></p>
            <Link to="/">
                <button onClick={handleClick}> Rejouer !</button>
            </Link>
        </>
    )
}