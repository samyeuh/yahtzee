import React, { createContext, useState, useContext, ReactNode } from 'react';

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
}

const GameplayContext = createContext<GameplayContextType>({
  roundActive: true, 
  setRoundActive: () => {},
  gameActive: true,
  setGameActive: () => {},
  playerName: "",
  setPlayerName: () => {},
  score: 0,
  setScore: () => {}
});

export const GameplayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roundActive, setRoundActive] = useState<boolean>(true);
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [playerName, setPlayerName ] = useState<string>("");
  const [score, setScore ] = useState<number>(0); 

  const value = {
    roundActive,
    setRoundActive,
    gameActive,
    setGameActive,
    playerName,
    setPlayerName,
    score,
    setScore
  };

  return (
    <GameplayContext.Provider value={value}>
      {children}
    </GameplayContext.Provider>
  );
};

export const useGameplayContext = () => useContext(GameplayContext);
