import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Combi } from '../../class/Combi';
// Création du type pour le contexte
interface GameplayContextType {
    roundActive: boolean;
    setRoundActive: (active: boolean) => void;
    gameActive: boolean;
    setGameActive: (active: boolean) => void;
    score: number;
    setScore: (score: number) => void;
    combiSimplesFinal: Combi[];
    setCombiSimplesFinal: (combi: Combi[]) => void;
    combiComplexesFinal: Combi[];
    setCombiComplexesFinal: (combi: Combi[]) => void;
    defaultCombiComplexes: {nom: string, score: number, hover: string, hoverDices: string[]}[];
    setDefaultCombiComplexes: (combi: {nom: string, score: number, hover: string, hoverDices: string[]}[]) => void,
    defaultCombiSimples: {nom: string, score: number, hover: string, hoverDices: string[]}[];
    loading: boolean;
    setLoading: (loa: boolean) => void;
    resetTab: boolean;
    setResetTab: (res: boolean) => void;
}

const GameplayContext = createContext<GameplayContextType>({
  roundActive: true, 
  setRoundActive: () => {},
  gameActive: true,
  setGameActive: () => {},
  score: 0,
  setScore: () => {},
  combiSimplesFinal: [],
  setCombiSimplesFinal: () => {},
  combiComplexesFinal: [],
  setCombiComplexesFinal: () => {},
  defaultCombiComplexes: [],
  setDefaultCombiComplexes: () => {},
  defaultCombiSimples: [],
  loading: false,
  setLoading: () => {},
  resetTab: false,
  setResetTab: () => {}
});

export const GameplayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roundActive, setRoundActive] = useState<boolean>(true);
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [score, setScore ] = useState<number>(0);
  const [combiSimplesFinal, setCombiSimplesFinal] = useState<Combi[]>([]);
  const [combiComplexesFinal, setCombiComplexesFinal] = useState<Combi[]>([]);
  const [defaultCombiComplexes, setDefaultCombiComplexes] = useState<{nom: string, score: number, hover: string, hoverDices: string[]}[]>([
    {nom: 'three of a kind', score: -1, hover: "sum of the dice you have in triplicate", hoverDices: [""]},
    {nom: 'four of a kind', score: -1, hover: "sum of the dice you have in quadruple", hoverDices: ["/dice2.jpg"]},
    {nom: 'full house', score: -1, hover: "three of one dice and two of another (25pts)", hoverDices: ["/dice3.jpg"] },
    {nom: 'small straight', score: -1, hover: "four sequential dice (30 pts)", hoverDices: ["/dice4.jpg"] },
    {nom: 'large straight', score: -1, hover: "five sequential dice (40 pts)", hoverDices: ["/dice5.jpg"] },
    {nom: 'yahtzee', score: -1, hover: "all five dice the same (50 pts)", hoverDices: ["/dice6.jpg"] },
    {nom: 'chance', score: -1, hover: "sum of all your dices", hoverDices: ["/dice1.jpg"]}
]);

const [defaultCombiSimples] = useState<{nom: string, score: number, hover: string, hoverDices: string[]}[]>([
  {nom: 'aces', score: -1, hover: "sum of the one", hoverDices: ["/dice1.jpg"] },
  {nom: 'twos', score: -1, hover: "sum of the two", hoverDices: ["/dice2.jpg"] },
  {nom: 'threes', score: -1, hover: "sum of the three", hoverDices: ["/dice3.jpg"] },
  {nom: 'fours', score: -1, hover: "sum of the four", hoverDices: ["/dice4.jpg"] },
  {nom: 'fives', score: -1, hover: "sum of the five", hoverDices: ["/dice5.jpg"] },
  {nom: 'sixes', score: -1, hover: "sum of the sixe", hoverDices: ["/dice6.jpg"] }      
]);
  const [loading, setLoading] = useState(false);
  const [resetTab, setResetTab] = useState(true);



  const value = {
    roundActive,
    setRoundActive,
    gameActive,
    setGameActive,
    score,
    setScore,
    combiSimplesFinal,
    setCombiSimplesFinal,
    combiComplexesFinal,
    setCombiComplexesFinal,
    defaultCombiComplexes,
    setDefaultCombiComplexes,
    defaultCombiSimples,
    loading,
    setLoading,
    resetTab,
    setResetTab
  };

  return (
    <GameplayContext.Provider value={value}>
      {children}
    </GameplayContext.Provider>
  );
};

export const useGameplayContext = () => useContext(GameplayContext);