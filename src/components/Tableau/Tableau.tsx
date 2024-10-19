import React, { CSSProperties, useEffect, useState } from 'react';
import './Tableau.css';
import { Combi } from '../../class/Combi';
import CombiTooltip from '../CombiToolTip/CombiToolTip';

const Tableau: React.FC<{combis: Combi[], caption: string, clickFunc(combi: Combi): Promise<void>, resetTab: boolean, selectedCombi: String[]}> = ({combis, caption, clickFunc, resetTab, selectedCombi}) => {
    const defaultCombiStyle = new Array(combis.length).fill({color: "grey"})
    const [styleOfCombi, setStyleOfCombi] = useState<CSSProperties[]>(defaultCombiStyle);
    const [tooltipInfo, setTooltipInfo] = useState<{description: string, imageUrl: string[], posX: number, posY: number} | null>(null);

    useEffect(() => {
        if (resetTab == true){
            setStyleOfCombi(defaultCombiStyle)
        }
    }, [resetTab])

    useEffect(() => {
        
    }, [selectedCombi])

    const handleClickCombi = (combi: Combi, index: number) => {
        if ((combi.score === -1) || (combi.nom === 'Total score')){
            console.error("Not time to choose !");
        } else {
            clickFunc(combi);
            setStyleOfCombi((soc) => soc.map((s, i) => {
                return (i === index) ? {color: 'black'} : s;
            }));    
        }
    }

    const handleMouseOver = (event: React.MouseEvent, description: string, imageUrl: string[]) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipInfo({
            description,
            imageUrl,
            posX: rect.x + window.scrollX + rect.width / 2, // Positionnement au centre de la cellule
            posY: rect.y + window.scrollY - 10 // Juste au-dessus de la cellule
        });
    };

    const handleMouseOut = () => {
        setTooltipInfo(null); // Cache la bulle au survol
    };

    return(
        <div>
        <table style={{boxShadow: '8px 8px 10px 0 rgba(0,0,0,0.5)', borderRadius: '20px'}}>
            <thead>
                <tr>
                    <th colSpan={2} style={{borderRadius: '10px', fontWeight: 'bold', textAlign: 'center'}}>{caption}</th>
                </tr>
            </thead>
            <tbody>
                {combis.map((ligne, index) => {
                    const isTotalRow = ligne.nom == "total score";
                    const isChanceRow = ligne.nom === 'chance';
                    const isAlreadySelected = selectedCombi.includes(ligne.nom);
                    const notHaveScore = ligne.score == -1;
                    return (
                        <tr key={isTotalRow ? 'total' : index} style={isTotalRow || isChanceRow ? {background: 'linear-gradient(to bottom, white, lightblue)'} : {backgroundColor: 'white'}}>
                            <td 
                                className="combi" 
                                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: "black"}}
                                onMouseOver={(e) => handleMouseOver(e, ligne.hover, ligne.hoverDices)} // Afficher la bulle
                                onMouseOut={handleMouseOut}
                            >
                                {ligne.nom}
                            </td>
                            <td 
                                className={isAlreadySelected || notHaveScore || isTotalRow ? 'scoreWithoutHover' : 'scoreWithHover'}
                                style={isTotalRow ? {color: 'black', cursor: 'default'} : styleOfCombi[index]} 
                                onClick={!isTotalRow ? () => handleClickCombi(ligne, index) : undefined}
                            >
                                {ligne.score !== -1 ? ligne.score : null}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        {/* Affichage conditionnel de la bulle */}
        {tooltipInfo && tooltipInfo.description != "" && (
            <div style={{ position: 'absolute', top: tooltipInfo.posY, left: tooltipInfo.posX, transform: 'translateX(-50%)' }}>
                <CombiTooltip description={tooltipInfo.description} imageUrls={tooltipInfo.imageUrl} />
            </div>
        )}
    </div>
    );
}

export default Tableau;
