import React, { CSSProperties, useState } from 'react';
import './Tableau.css';

export type Combi = {
    nom: string,
    imageUrls: string[],
    score: number
}

const Tableau: React.FC<{combis: Combi[], caption: string,  clickFunc(combi: Combi): Promise<void>}> = ({combis, caption, clickFunc}) => {
    // TODO: améliorer style
    const [styleOfCombi, setStyleOfCombi] = useState<CSSProperties[]>(new Array(combis.length).fill({color: "black"}));

    const handleClickCombi = (combi: Combi, index: number) => {
        if (combi.score === -1){
            console.error("Ce n'est pas le moment de choisir !");
        } else {
            clickFunc(combi);
            setStyleOfCombi((soc) => soc.map((s, i) => {
                return (i === index) ? {backgroundColor: 'red'} : s;
            }));    
        }
    }

    return(
        <table style={{boxShadow: '8px 8px 10px 0 rgba(0,0,0,0.5)'}}>
            <caption style={{fontWeight: 'bold'}}>{caption}</caption>
            <thead>
                <tr>
                    <th>Combinaison</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {combis.map((ligne, index) => (
                    <tr key={index}>
                        <td className="combi" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: "black"}}>{ligne.nom} {ligne.imageUrls.map((url) => (<img style={{width: '30px', height: '30px'}}src={url} alt="dice"/>))} </td>
                        <td className="score" style={styleOfCombi[index]} onClick={() => {handleClickCombi(ligne, index)}}>{ligne.score !== -1 ? ligne.score : null}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Tableau;