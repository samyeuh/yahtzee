import React, { createContext, useState, useContext, ReactNode } from 'react';
import Yahtzee from '../../logic/yahtzee';
import { Combi } from '../../class/Combi';

interface YahtzeeContextType {
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
    yahtzeeLogic: Yahtzee;
    setYahtzeeLogic: (yahtzee: Yahtzee) => void;
    time: number;
    setTime: (time: number) => void;
}

const YahtzeeContext = createContext<YahtzeeContextType | undefined>(undefined);

export const YahtzeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roundActive, setRoundActive] = useState<boolean>(true);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [score, setScore ] = useState<number>(0);
  const [combiSimplesFinal, setCombiSimplesFinal] = useState<Combi[]>([]);
  const [combiComplexesFinal, setCombiComplexesFinal] = useState<Combi[]>([]);
  const [defaultCombiComplexes, setDefaultCombiComplexes] = useState<{nom: string, score: number, hover: string, hoverDices: string[]}[]>([
    {nom: 'three of a kind', score: -1, hover: "sum of the dice you have in triplicate", hoverDices: ["/dices/dice1.png"]},
    {nom: 'four of a kind', score: -1, hover: "sum of the dice you have in quadruple", hoverDices: ["/dices/dice1.png"]},
    {nom: 'full house', score: -1, hover: "three of one dice and two of another (25pts)", hoverDices: ["/dices/dice1.png"] },
    {nom: 'small straight', score: -1, hover: "four sequential dice (30 pts)", hoverDices: ["/dices/dice1.png"] },
    {nom: 'large straight', score: -1, hover: "five sequential dice (40 pts)", hoverDices: ["/dices/dice1.png"] },
    {nom: 'yahtzee', score: -1, hover: "all five dice the same (50 pts)", hoverDices: ["/dices/dice1.png"] },
    {nom: 'chance', score: -1, hover: "sum of all your dices", hoverDices: ["/dices/dice1.png"]}
]);

const [defaultCombiSimples] = useState<{nom: string, score: number, hover: string, hoverDices: string[]}[]>([
  {nom: 'aces', score: -1, hover: "sum of the one", hoverDices: ["/dices/dice1.png"] },
  {nom: 'twos', score: -1, hover: "sum of the two", hoverDices: ["/dices/dice2.png"] },
  {nom: 'threes', score: -1, hover: "sum of the three", hoverDices: ["/dices/dice3.png"] },
  {nom: 'fours', score: -1, hover: "sum of the four", hoverDices: ["/dices/dice4.png"] },
  {nom: 'fives', score: -1, hover: "sum of the five", hoverDices: ["/dices/dice5.png"] },
  {nom: 'sixes', score: -1, hover: "sum of the six", hoverDices: ["/dices/dice6.png"] }      
]);
  const [loading, setLoading] = useState(false);
  const [resetTab, setResetTab] = useState(true);
  const [yahtzeeLogic, setYahtzeeLogic] = useState(() => new Yahtzee());
  const [time, setTime] = useState(0);


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
    setResetTab,
    yahtzeeLogic,
    setYahtzeeLogic,
    time,
    setTime
  };

  return (
    <YahtzeeContext.Provider value={value}>
      {children}
    </YahtzeeContext.Provider>
  );
};

export const useYahtzeeContext = () => {
  const context = useContext(YahtzeeContext);
  if (!context) {
    throw new Error("useYahtzeeContext must be used within a YahtzeeProvider");
  }
  return context;
};
