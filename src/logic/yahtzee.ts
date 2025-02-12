import { Combinations } from "../class/Combi";
import { startCheckingScore } from "./scoreCalculator";
import { generateComplexeExamples } from "./exampleGenerator";

class Yahtzee{
    private score: number;
    private combinations: Combinations;
    private nbTurn: number = 3;
    private diceKeep: number[] = [];
    private dice: number[] = [0,0,0,0,0];

    constructor(){
        this.score = 0;
        this.combinations = {
            complexe: [
                { nom: "three of a kind", score: -1, hover: "", hoverDices: [] },
                { nom: "four of a kind", score: -1, hover: "", hoverDices: [] },
                { nom: "full house", score: -1, hover: "", hoverDices: [] },
                { nom: "small straight", score: -1, hover: "", hoverDices: [] },
                { nom: "large straight", score: -1, hover: "", hoverDices: [] },
                { nom: "yahtzee", score: -1, hover: "", hoverDices: [] },
                { nom: "chance", score: -1, hover: "", hoverDices: [] }
            ],
            simple: [
                { nom: "aces", score: -1, hover: "", hoverDices: [] },
                { nom: "twos", score: -1, hover: "", hoverDices: [] },
                { nom: "threes", score: -1, hover: "", hoverDices: [] },
                { nom: "fours", score: -1, hover: "", hoverDices: [] },
                { nom: "fives", score: -1, hover: "", hoverDices: [] },
                { nom: "sixes", score: -1, hover: "", hoverDices: [] }
            ]
        }
    }

    public initRound(): void{
        this.nbTurn = 3;
        this.diceKeep = [];
        this.dice = [0,0,0,0,0];
    }

    public rollDice(): {nbTurn: number; dice: number[];} {
        for(let i = 0; i < 5; i++){
            if(this.diceKeep.indexOf(i) === -1){
                this.dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        this.nbTurn--;
        return {nbTurn: this.nbTurn, dice: this.dice};
        
    }

    public keepDice(indexs: number[]): void{
        this.diceKeep = indexs;
    }

    public calculateScore(){
        this.combinations = startCheckingScore(this.dice, this.combinations);
    }

    public getCombinations(): Combinations{
        return this.combinations;
    }

    public setCombinations(combination: Combinations): void{
        this.combinations = combination;
    }

    public getScore(): number{
        return this.score;
    }

    public addScore(scoreAdded: number): number{
        this.score += scoreAdded;
        return this.score;
    }

    public restartGame(): void {
        this.score = 0;
        this.combinations = {
            complexe: [
                { nom: "three of a kind", score: -1, hover: "", hoverDices: [] },
                { nom: "four of a kind", score: -1, hover: "", hoverDices: [] },
                { nom: "full house", score: -1, hover: "", hoverDices: [] },
                { nom: "small straight", score: -1, hover: "", hoverDices: []},
                { nom: "large straight", score: -1, hover: "", hoverDices: [] },
                { nom: "yahtzee", score: -1, hover: "", hoverDices: [] },
                { nom: "chance", score: -1, hover: "", hoverDices: [] }
            ],
            simple: [
                { nom: "aces", score: -1, hover: "", hoverDices: [] },
                { nom: "twos", score: -1, hover: "", hoverDices: [] },
                { nom: "threes", score: -1, hover: "", hoverDices: [] },
                { nom: "fours", score: -1, hover: "", hoverDices: [] },
                { nom: "fives", score: -1, hover: "", hoverDices: [] },
                { nom: "sixes", score: -1, hover: "", hoverDices: [] }
            ]
        }
        this.initRound();
    }

    public getToolTipDice(): Record<string, string[]> {

        let toolTipCombi: Record<string, string[]> = {
            threeOfAKind: [],
            fourOfAKind: [],
            fullHouse: [],
            smallStraight: [],
            largeStraight: [],
            yahtzee: [],
            chance: []
        };

        return generateComplexeExamples(toolTipCombi);

    }

        
}

export default Yahtzee;