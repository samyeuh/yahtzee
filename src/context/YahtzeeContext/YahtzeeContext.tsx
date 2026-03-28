import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Yahtzee from '../../logic/yahtzee';
import { Combi } from '../../class/Combi';
import { useSettings, Settings } from '../../hooks/useSettings';

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
    isSaved: boolean;
    setIsSaved: (saved: boolean) => void;
    // ── Settings ──
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const YahtzeeContext = createContext<YahtzeeContextType | undefined>(undefined);

export const YahtzeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roundActive, setRoundActive] = useState<boolean>(true);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combiSimplesFinal, setCombiSimplesFinal] = useState<Combi[]>([]);
  const [combiComplexesFinal, setCombiComplexesFinal] = useState<Combi[]>([]);
  const [defaultCombiComplexes, setDefaultCombiComplexes] = useState([
    {nom: 'three of a kind', score: -1, hover: "sum of all your dices", hoverDices: ["/dices/dice1.png"]},
    {nom: 'four of a kind', score: -1, hover: "sum of all your dices", hoverDices: ["/dices/dice1.png"]},
    {nom: 'full house', score: -1, hover: "three of one dice and two of another (25pts)", hoverDices: ["/dices/dice1.png"]},
    {nom: 'small straight', score: -1, hover: "four sequential dice (30 pts)", hoverDices: ["/dices/dice1.png"]},
    {nom: 'large straight', score: -1, hover: "five sequential dice (40 pts)", hoverDices: ["/dices/dice1.png"]},
    {nom: 'yahtzee', score: -1, hover: "all five dice the same (50 pts)", hoverDices: ["/dices/dice1.png"]},
    {nom: 'chance', score: -1, hover: "sum of all your dices", hoverDices: ["/dices/dice1.png"]}
  ]);

  const [defaultCombiSimples] = useState([
    {nom: 'aces', score: -1, hover: "sum of the one", hoverDices: ["/dices/dice1.png"]},
    {nom: 'twos', score: -1, hover: "sum of the two", hoverDices: ["/dices/dice2.png"]},
    {nom: 'threes', score: -1, hover: "sum of the three", hoverDices: ["/dices/dice3.png"]},
    {nom: 'fours', score: -1, hover: "sum of the four", hoverDices: ["/dices/dice4.png"]},
    {nom: 'fives', score: -1, hover: "sum of the five", hoverDices: ["/dices/dice5.png"]},
    {nom: 'sixes', score: -1, hover: "sum of the six", hoverDices: ["/dices/dice6.png"]}
  ]);

  const [loading, setLoading] = useState(false);
  const [resetTab, setResetTab] = useState(false);
  const [yahtzeeLogic, setYahtzeeLogic] = useState(() => new Yahtzee());
  const [time, setTime] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const { settings, updateSetting } = useSettings();

  // ── Apply theme on settings change ──
  useEffect(() => {
    document.documentElement.style.setProperty('--bg', settings.bgColor);
    document.body.style.backgroundColor = settings.bgColor;
  }, [settings.bgColor]);

  // ── Apply volume to yahtzeeLogic on settings change ──
  useEffect(() => {
    yahtzeeLogic.setVolume(settings.muted ? 0 : settings.volume);
  }, [settings.volume, settings.muted]);

  const value = {
    roundActive, setRoundActive,
    gameActive, setGameActive,
    score, setScore,
    combiSimplesFinal, setCombiSimplesFinal,
    combiComplexesFinal, setCombiComplexesFinal,
    defaultCombiComplexes, setDefaultCombiComplexes,
    defaultCombiSimples,
    loading, setLoading,
    resetTab, setResetTab,
    yahtzeeLogic, setYahtzeeLogic,
    time, setTime,
    isSaved, setIsSaved,
    settings, updateSetting,
  };

  return (
    <YahtzeeContext.Provider value={value}>
      {children}
    </YahtzeeContext.Provider>
  );
};

export const useYahtzeeContext = () => {
  const context = useContext(YahtzeeContext);
  if (!context) throw new Error("useYahtzeeContext must be used within a YahtzeeProvider");
  return context;
};