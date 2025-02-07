import { useEffect, useState } from "react";
import Tableau from "../Tableau/Tableau";
import { useGameplayContext } from "../../context/GameplayContext/GameplayContext";
import { Combi } from "../../class/Combi";
import { YahtzeeAPI } from "../../api/YahtzeeAPI";
import './Combinations.css';
interface Combinations {
    simple: Combi[];
    complexe: Combi[];
  }


export function Combinations() {

    const initializeUser = () => {
        let userId = localStorage.getItem('userId');
        if (!userId){
          userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          localStorage.setItem('userId', userId);
        }
        return userId;
      }

    const { roundActive, setRoundActive, gameActive, setGameActive, score, setScore, setCombiSimplesFinal, setCombiComplexesFinal, defaultCombiComplexes, defaultCombiSimples, resetTab, setResetTab } = useGameplayContext();
    const { getCombinations, getTooltipDices, setCombinations, updateScore } = YahtzeeAPI(initializeUser());

    const combiTotal = {nom: 'total score', imageUrls: [], score: score, hover: "", hoverDices: []};


    const [combiComplexes, setCombiComplexes] = useState<Combi[]>(defaultCombiComplexes);
    const [combiSimples, setCombiSimples] =  useState<Combi[]>(defaultCombiSimples);
    const [combiSimpleToDisplay, setCombiSimpleToDisplay] = useState<Combi[]>(combiSimples);
    const [combiComplexeToDisplay, setCombiComplexeToDisplay] = useState<Combi[]>(combiComplexes);
    const [combiSelected, setCombiSelected] = useState<String[]>([]);

    const handleToolTip = async (): Promise<void> => {
        try {
          const tooltip = await getTooltipDices();
          var combiComplexeCopy = defaultCombiComplexes;
          const updatedCombiComplexes = combiComplexeCopy.map((combi) => {
              switch (combi.nom){
                  case 'three of a kind':
                      return {...combi, hoverDices: tooltip.threeOfAKind};
                  case 'four of a kind':
                      return {...combi, hoverDices: tooltip.fourOfAKind};
                  case 'full house':
                      return {...combi, hoverDices: tooltip.fullHouse};
                  case 'small straight':
                      return {...combi, hoverDices: tooltip.smallStraight};
                  case 'large straight':
                      return {...combi, hoverDices: tooltip.largeStraight};
                  case 'yahtzee':
                      return {...combi, hoverDices: tooltip.yahtzee};
                  case 'chance':
                      return {...combi, hoverDices: tooltip.chance};
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
        if (combiSelected.length === 13){
            setRoundActive(false);
            setGameActive(false);
            setCombiSimplesFinal(combiSimpleToDisplay);
            setCombiComplexesFinal(combiComplexeToDisplay);
        }
    }, [combiSelected]);

    useEffect(() => {
        if (resetTab) {
            setCombiSimples(defaultCombiSimples);
            setCombiComplexes(defaultCombiComplexes);
            setCombiSelected([]);
        }
    }, [resetTab]);


    const updateTheScore = async (combi: Combi): Promise<void> => {
        try {
            let newScore = await updateScore(combi.score);
            setScore(parseInt(newScore.score));
        } catch (error) {
            console.error("Erreur: " + error);
        }
    };


    const addCombi = (combi: Combi): number => {
        var combiSelectedList = [...combiSelected, combi.nom];
        setCombiSelected(combiSelectedList);

        setResetTab(false)
        return combi.score;
    };

    const getCombi = async (): Promise<void> => {
        if ((roundActive == true) && (gameActive == false)) {
            return;
        }
        try {
            const possibleCombinations = await getCombinations();
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
            setCombiSimples((combiSimples) => combiSimples.map(c => {
                return {
                    ...c,
                    score: (c.nom === combi.nom) ? addCombi(combi) : c.score
                };
            }));

            setCombiComplexes((combiComplexes) => combiComplexes.map(c => {
                return {
                    ...c,
                    score: (c.nom === combi.nom) ? addCombi(combi) : c.score
                };
            }));
            updateTheScore(combi);
            setCombiComplexeToDisplay(combiComplexes);
            setCombiSimpleToDisplay(combiSimples);
            const combinations: Combinations = {simple: combiSimples, complexe: combiComplexes};
            await setCombinations(combinations);
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
                    />
                </div>
                <div style={{marginLeft: '5px'}}>
                    <Tableau 
                        combis={[...combiSimpleToDisplay, combiTotal]} 
                        caption={"upper section"} 
                        clickFunc={chooseThisCombination}
                        resetTab={resetTab}
                        selectedCombi={combiSelected}
                    />
                </div>
            </div>
        </>
    )
}