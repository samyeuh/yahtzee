import { useEffect, useState } from "react";
import Tableau, { Combi } from "../Tableau/Tableau";
import { useGameplayContext } from "../../context/GameplayContext/GameplayContext";
import { CombinationsAPI } from "./CombinationsAPI";

interface Combinations {
    simple: Combi[];
    complexe: Combi[];
  }


export function Combinations() {

    var dice_one = "/dice1.jpg";
    var dice_two = "/dice2.jpg";
    var dice_three = "/dice3.jpg";
    var dice_four = "/dice4.jpg";
    var dice_five = "/dice5.jpg";
    var dice_six = "/dice6.jpg";

    const { roundActive, setRoundActive, gameActive, setGameActive, setScore } = useGameplayContext();
    const { getCombinations, setCombinations, updateScore } = CombinationsAPI();

    const [combiComplexes, setCombiComplexes] = useState<Combi[]>( [
        {nom: 'Brelan', imageUrls: [dice_three, dice_three, dice_three, dice_one, dice_five], score: -1 },
        {nom: 'Carré', imageUrls: [dice_four, dice_four, dice_four, dice_four, dice_six], score: -1 },
        {nom: 'Full', imageUrls: [dice_two, dice_two, dice_two, dice_six, dice_six], score: -1 },
        {nom: 'Petite Suite', imageUrls: [dice_one, dice_two, dice_three, dice_four, dice_six], score: -1 },
        {nom: 'Grande Suite', imageUrls: [dice_one, dice_two, dice_three, dice_four, dice_five], score: -1 },
        {nom: 'Yams', imageUrls: [dice_five, dice_five, dice_five, dice_five, dice_five], score: -1 },
        {nom: 'Chance', imageUrls: [], score: -1}
    ]);

    const [combiSimples, setCombiSimples] =  useState<Combi[]>([
        {nom: 'Un', imageUrls: [dice_one], score: -1 },
        {nom: 'Deux', imageUrls: [dice_two], score: -1 },
        {nom: 'Trois', imageUrls: [dice_three], score: -1 },
        {nom: 'Quatre', imageUrls: [dice_four], score: -1 },
        {nom: 'Cinq', imageUrls: [dice_five], score: -1 },
        {nom: 'Six', imageUrls: [dice_six], score: -1 }
    ]);

    const [ combiSimpleToDisplay, setCombiSimpleToDisplay ] = useState<Combi[]>(combiSimples);
    const [ combiComplexeToDisplay, setCombiComplexeToDisplay ] = useState<Combi[]>(combiComplexes);
    const [ combiSelected, setCombiSelected ] = useState<String[]>([]);

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
        }
    }, [combiSelected]);
    
/*
Faire pixel art pour les dés
https://www.piskelapp.com/p/create/sprite
ou demander à Tofu pour créer pixel arts (6 dés + gif qui tourne)
*/


    const updateTheScore = async (combi: Combi): Promise<void> => {
        try {
            let newScore = await updateScore(combi.score);
            setScore(parseInt(newScore.score));
        } catch (error) {
            console.error("Erreur: " + error);
        }
    }


    const addCombi = (combi: Combi): number => {
        // passe deux fois ici ?
        var combiSelectedList = [...combiSelected, combi.nom];
        setCombiSelected(combiSelectedList);
        return combi.score;
    }

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
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Tableau combis={combiSimpleToDisplay} caption={"Combinaisons simples"} clickFunc={chooseThisCombination} />
            <div>
                <hr />
            </div>
            <Tableau combis={combiComplexeToDisplay} caption={"Combinaisons complexes"} clickFunc={chooseThisCombination} />
        </div>
    )
}