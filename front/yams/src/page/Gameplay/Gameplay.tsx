import { Combinations } from '../../components/Combinations/Combinations';
import { RollingDices } from '../../components/RollingDices/RollingDices';
import { useNavigate } from 'react-router'; 
import { useEffect } from 'react';
import { useGameplayContext } from '../../context/GameplayContext/GameplayContext';

export function Gameplay() {
    const { gameActive } = useGameplayContext();

    //TODO: faire en sorte qu'on puisse pas arriver sur cette page direct
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
            <div style={{display: 'flex'}}>
                {/* Faire un bouton pour expliquer les combinaisons */}
                <div style={{width: '500px'}}>
                    <Combinations />
                </div>
                <div style={{alignItems: 'center', width: '1000px'}}>
                    <RollingDices />
                </div>
            </div>
        </>
    )



}   