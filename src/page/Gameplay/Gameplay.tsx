import { Combinations } from '../../components/Combinations/Combinations';
import { RollingDices } from '../../components/RollingDices/RollingDices';
import { useNavigate } from 'react-router'; 
import { useEffect } from 'react';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';
import './Gameplay.css';

export function Gameplay() {
  // TODO: Rules modal into navbar
  // TODO: qd on a finit de cliquer sur roll, modal des combinaisons ! :)

    const { gameActive } = useGameplayContext();
    const navigate = useNavigate();

    const { playerName } = useGameplayContext();
  
    useEffect(() => {
      if (playerName === ""){
        navigate('/');
      }
    }, []);

    useEffect(() => {
      if (gameActive == false){
        navigate('/end');
      }
  }, [gameActive]);

    return(
        <>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px'}}>
                {/* Faire un bouton pour expliquer les combinaisons */}
                <div>
                    <RollingDices />
                </div>
                <div>
                    <Combinations />
                </div>
            </div>
        </>
    )



}   