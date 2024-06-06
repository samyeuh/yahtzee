import { Link, useNavigate } from 'react-router-dom';
import { EndpageAPI } from './EndpageAPI';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import { useEffect } from 'react';
import Tableau, { Combi } from '../../components/Tableau/Tableau';

export function Endpage() {

    const navigate = useNavigate();
    
    const { restartGame } = EndpageAPI();
    const { score, playerName, setPlayerName, setScore, combiSimplesFinal, combiComplexesFinal } = useGameplayContext();

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
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2> Merci d'avoir joué {playerName} ! ☻</h2>
            <p> Votre score : <b>{score}</b></p>
            <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px', textAlign: 'center'}}>
                <div style={{marginRight: '5px'}}>
                    <Tableau combis={combiSimplesFinal} caption={"Combinaisons simples"} clickFunc={async (combi: Combi) => {console.log(combi)}}/>
                </div>
                <div style={{marginLeft: '5px'}}>
                    <Tableau combis={combiComplexesFinal} caption={"Combinaisons complexes"} clickFunc={async (combi: Combi) => {console.log(combi)}} />
                </div>
            </div>
            
            <Link to="/">
                <button onClick={handleClick}> Rejouer !</button>
            </Link>
        </div>
    </>
    )
}