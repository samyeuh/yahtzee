import { useEffect, useState } from "react";
import Tableau from "../Tableau/Tableau";
import { useYahtzeeContext } from "../../context/YahtzeeContext/YahtzeeContext";
import { Combi } from "../../class/Combi";
import './Combinations.css';
interface Combinations {
    simple: Combi[];
    complexe: Combi[];
  }


export function Combinations({ stopTimer }: { stopTimer: () => void }) {

    const { roundActive, setRoundActive, 
        gameActive, setGameActive, 
        score, setScore, 
        setCombiSimplesFinal, 
        setCombiComplexesFinal, 
        defaultCombiComplexes, 
        defaultCombiSimples, 
        resetTab, setResetTab,
        yahtzeeLogic } = useYahtzeeContext();

    const combiTotal = {nom: 'total score', imageUrls: [], score: score, hover: "", hoverDices: []};


    const [combiComplexes, setCombiComplexes] = useState<Combi[]>(defaultCombiComplexes);
    const [combiSimples, setCombiSimples] =  useState<Combi[]>(defaultCombiSimples);
    const [combiSimpleToDisplay, setCombiSimpleToDisplay] = useState<Combi[]>(combiSimples);
    const [combiComplexeToDisplay, setCombiComplexeToDisplay] = useState<Combi[]>(combiComplexes);
    const [combiSelected, setCombiSelected] = useState<String[]>([]);
    const [isGameFinished, setIsGameFinished] = useState(false);


    const handleToolTip = async (): Promise<void> => {
        try {
          const tooltip = yahtzeeLogic.getToolTipDice();
          console.log("handletooltip combi");
          var combiComplexeCopy = defaultCombiComplexes.map((combi) => combi);
          const updatedCombiComplexes = combiComplexeCopy.map((combi) => {
              switch (combi.nom){
                  case 'three of a kind':
                      return {...combi, hoverDices: tooltip['threeOfAKind']};
                  case 'four of a kind':
                      return {...combi, hoverDices: tooltip['fourOfAKind']};
                  case 'full house':
                      return {...combi, hoverDices: tooltip['fullHouse']};
                  case 'small straight':
                      return {...combi, hoverDices: tooltip['smallStraight']};
                  case 'large straight':
                      return {...combi, hoverDices: tooltip['largeStraight']};
                  case 'yahtzee':
                      return {...combi, hoverDices: tooltip['yahtzee']};
                  case 'chance':
                      return {...combi, hoverDices: tooltip['chance']};
                  default:
                      return combi;
              }
          });
          setCombiComplexes(updatedCombiComplexes)
          } catch (error) {
            console.error("error" + error);
          }
        }
        
        useEffect(() => {
          handleToolTip();
        }, [])

    useEffect(() => {
        setCombiSimpleToDisplay(combiSimples);
    }, [combiSimples]);
    
    useEffect(() => {
        setCombiComplexeToDisplay(combiComplexes);
    }, [combiComplexes]);

    useEffect(() => {
        getCombi();
    }, [roundActive]);

    useEffect(() => {
        if (combiSelected.length === 13) {
            setIsGameFinished(true);
        }
    }, [combiSelected]);

    useEffect(() => {
        if (isGameFinished) {
            stopTimer();
            setRoundActive(false);
            setGameActive(false);
            setCombiSimplesFinal([...combiSimpleToDisplay]);
            setCombiComplexesFinal([...combiComplexeToDisplay]);
        }
        }, [isGameFinished]);
    

    useEffect(() => {
        console.log("resetTab effect triggered");
        if (resetTab) {
            setCombiSimples(defaultCombiSimples.map(c => ({ ...c, score: -1 })));
            setCombiComplexes(defaultCombiComplexes.map(c => ({ ...c, score: -1 })));
            setCombiSelected([]);
            setResetTab(false);
        }
    }, [resetTab]);
    


    const updateTheScore = async (combi: Combi): Promise<void> => {
        try {
            let newScore = yahtzeeLogic.addScore(combi.score);
            setScore(newScore);
        } catch (error) {
            console.error("Erreur: " + error);
        }
    };


    const addCombi = (combi: Combi): number => {

        return combi.score;
    };

    const getCombi = async (): Promise<void> => {
        if ((roundActive == true) && (gameActive == false)) {
            return;
        }
        try {
            const possibleCombinations = yahtzeeLogic.getCombinations();
            setCombiSimpleToDisplay((combiSimples) => combiSimples.map(combi => {
                const found = possibleCombinations.simple.find((c: Combi) => (combi.nom === c.nom) && (!combiSelected.includes(c.nom)));
                return {
                    ...combi,
                    score: found ? found.score : combi.score
                };
            }));

            setCombiComplexeToDisplay((combiComplexes) => combiComplexes.map(combi => {
                const found = possibleCombinations.complexe.find((c: Combi) => (combi.nom === c.nom) && (!combiSelected.includes(c.nom)));
                return {
                    ...combi,
                    score: found ? found.score : combi.score
                };
            }));
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const chooseThisCombination = async (combi: Combi): Promise<void> => {
        if (combiSelected?.includes(combi.nom)){
            console.error("Combinaison déjà choisie");
        }else{
            
            const updateScore = addCombi(combi);
            const updatedSimples = combiSimples.map(c => {
                return {
                    ...c,
                    score: (c.nom === combi.nom) ? updateScore : c.score
                }
            });
            setCombiSimples(updatedSimples);

            const updatedComplexes = combiComplexes.map(c => {
                return {
                    ...c,
                    score: (c.nom === combi.nom) ? updateScore : c.score
                }
            });
            setCombiComplexes(updatedComplexes);

            setCombiSelected((prevSelected) => [...prevSelected, combi.nom]);
            setResetTab(true);

            if (combi.nom === 'yahtzee' && combi.score === 50) {
                yahtzeeLogic.playSound("yahtzee");
            } else {
                yahtzeeLogic.playSound("scoring");
            }

            updateTheScore(combi);
            setCombiComplexeToDisplay(combiComplexes);
            setCombiSimpleToDisplay(combiSimples);
            const combinations: Combinations = {simple: combiSimples, complexe: combiComplexes};
            yahtzeeLogic.setCombinations(combinations);
            setRoundActive(true);
        }
    };

    return(
        <>
            <div className='tab-container'>
                <div style={{marginRight: '5px'}}>
                    <Tableau 
                        combis={combiComplexeToDisplay} 
                        caption={"lower section"} 
                        clickFunc={chooseThisCombination}
                        resetTab={resetTab}
                        selectedCombi={combiSelected}
                        wantedGrey={true}
                    />
                </div>
                <div style={{marginLeft: '5px'}}>
                    <Tableau 
                        combis={[...combiSimpleToDisplay, combiTotal]} 
                        caption={"upper section"} 
                        clickFunc={chooseThisCombination}
                        resetTab={resetTab}
                        selectedCombi={combiSelected}
                        wantedGrey={true}
                    />
                </div>
            </div>
        </>
    )
}