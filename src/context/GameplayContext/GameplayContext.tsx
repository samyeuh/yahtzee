import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Combi } from '../../components/Tableau/Tableau';

// Création du type pour le contexte
interface GameplayContextType {
    roundActive: boolean;
    setRoundActive: (active: boolean) => void;
    gameActive: boolean;
    setGameActive: (active: boolean) => void;
    playerName: string;
    setPlayerName: (name: string) => void;
    score: number;
    setScore: (score: number) => void;
    combiSimplesFinal: Combi[];
    setCombiSimplesFinal: (combi: Combi[]) => void;
    combiComplexesFinal: Combi[];
    setCombiComplexesFinal: (combi: Combi[]) => void;
}

const GameplayContext = createContext<GameplayContextType>({
  roundActive: true, 
  setRoundActive: () => {},
  gameActive: true,
  setGameActive: () => {},
  playerName: "",
  setPlayerName: () => {},
  score: 0,
  setScore: () => {},
  combiSimplesFinal: [],
  setCombiSimplesFinal: () => {},
  combiComplexesFinal: [],
  setCombiComplexesFinal: () => {}
});

export const GameplayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roundActive, setRoundActive] = useState<boolean>(true);
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [playerName, setPlayerName ] = useState<string>("");
  const [score, setScore ] = useState<number>(0);
  const [combiSimplesFinal, setCombiSimplesFinal] = useState<Combi[]>([]);
  const [combiComplexesFinal, setCombiComplexesFinal] = useState<Combi[]>([]); 

  const value = {
    roundActive,
    setRoundActive,
    gameActive,
    setGameActive,
    playerName,
    setPlayerName,
    score,
    setScore,
    combiSimplesFinal,
    setCombiSimplesFinal,
    combiComplexesFinal,
    setCombiComplexesFinal
  };

  return (
    <GameplayContext.Provider value={value}>
      {children}
    </GameplayContext.Provider>
  );
};

export const useGameplayContext = () => useContext(GameplayContext);
