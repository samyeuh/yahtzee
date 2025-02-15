import './ScoreDetails.css';
import Tableau from '../../components/Tableau/Tableau';
import { Combi, Combinations } from '../../class/Combi';

type DetailsProps = {
  closeFunction: () => void;
  playerDetails: any;
};

export function ScoreDetails({ closeFunction, playerDetails}: DetailsProps) {

    const combiTotal = {nom: 'total score', imageUrls: [], score: playerDetails["Score"], hover: "", hoverDices: []};

    const transformDetails = (playerDetails: any): Combinations => {
        console.log("📢 Contenu brut de playerDetails.Details :", playerDetails.Details);
    
        let parsedData;
    
        // Vérifier si `Details` est déjà un objet JSON
        if (typeof playerDetails.Details === "object") {
            parsedData = playerDetails.Details;
        } else {
            try {
                parsedData = JSON.parse(playerDetails.Details);
            } catch (error) {
                console.error("Erreur JSON.parse(Details):", error);
                return { simple: [], complexe: [] };
            }
        }
    
        console.log("📢 JSON parsé :", parsedData);
    
        const combiSimples: Combi[] = parsedData.simple || [];
        const combiComplexes: Combi[] = parsedData.complexe || [];
    
        return { simple: combiSimples, complexe: combiComplexes };
    };
    

    const playerDetailsTransformed = transformDetails(playerDetails);

  return (
            <div className="detailsContainer">
              <div className="detailsBox">
                <h1 style={{fontWeight: 'bold'}}>{playerDetails['Nom']}</h1>
                <img src={playerDetails['Icon']} alt="icon" style={{width: '75px', height: '75px'}}/>
                    <div className="detailsTabs">
                        <Tableau combis={playerDetailsTransformed.complexe} caption={"lower section"} clickFunc={() => Promise.resolve()} resetTab={false} selectedCombi={playerDetailsTransformed.complexe.map(combi => combi.nom)} wantedGrey={false}/>
                        <Tableau combis={[...playerDetailsTransformed.simple, combiTotal]} caption={"upper section"} clickFunc={() => Promise.resolve()} resetTab={false} selectedCombi={playerDetailsTransformed.simple.map(combi => combi.nom)} wantedGrey={false}/>
                    </div>
                <button className="fermerButton" onClick={closeFunction}>close</button>
              </div>
            </div>
    );
}
