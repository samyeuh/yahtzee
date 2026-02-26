import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import './Tableau.css';
import { Combi } from '../../class/Combi';
import CombiTooltip from '../CombiToolTip/CombiToolTip';

const Tableau: React.FC<{combis: Combi[], caption: string, clickFunc(combi: Combi): Promise<void>, resetTab: boolean, selectedCombi: String[], wantedGrey: boolean}> = ({combis, caption, clickFunc, resetTab, selectedCombi, wantedGrey}) => {
    const defaultCombiStyle = wantedGrey ? new Array(combis.length).fill({color: "grey"}) : new Array(combis.length).fill({color: "black"})
    const [styleOfCombi, setStyleOfCombi] = useState<CSSProperties[]>(defaultCombiStyle);
    const [tooltipInfo, setTooltipInfo] = useState<{description: string, imageUrl: string[], posX: number, posY: number} | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (resetTab == true) setStyleOfCombi(defaultCombiStyle)
    }, [resetTab])

    useEffect(() => {}, [selectedCombi])

    const handleClickCombi = (combi: Combi, index: number) => {
        if (!wantedGrey) return;
        if ((combi.score === -1) || (combi.nom === 'Total score')) {
            console.error("Not time to choose !");
        } else {
            clickFunc(combi);
            setStyleOfCombi((soc) => soc.map((s, i) => (i === index) ? {color: 'black'} : s));
        }
    }

    const handleMouseOver = (event: React.MouseEvent, description: string, imageUrl: string[]) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipInfo({ description, imageUrl, posX: rect.x + window.scrollX + rect.width / 2, posY: rect.y + window.scrollY - 10 });
    };

    const handleMouseOut = (event: React.MouseEvent) => {
        const toElement = event.relatedTarget as Node;
        if (tooltipRef.current && tooltipRef.current.contains(toElement)) return;
        setTooltipInfo(null);
    };

    const bestScore = Math.max(
        ...combis
            .filter(c => c.score > 0 && !selectedCombi.includes(c.nom) && c.nom !== 'total score' && c.nom !== 'chance')
            .map(c => c.score)
    );

    return (
        <div className="tableauWrapper">
            <div className="captionT">{caption}</div>
            <table className={wantedGrey ? "captionTableau" : "captionTableau shadow"}>
                <tbody>
                    {combis.map((ligne, index) => {
                        const isTotalRow = ligne.nom === "total score";
                        const isAlreadySelected = selectedCombi.includes(ligne.nom);
                        const notHaveScore = ligne.score === -1;
                        const isBest = wantedGrey && !isAlreadySelected && ligne.score === bestScore && bestScore > 0 && !isTotalRow;

                        let rowClass = '';
                        if (isTotalRow) rowClass = 'specialRow';
                        else if (isAlreadySelected) rowClass = 'selectedRow';
                        else if (isBest) rowClass = 'bestRow';

                        return (
                            <tr
                                key={isTotalRow ? 'total' : index}
                                className={rowClass}
                            >
                                <td
                                    className="combi"
                                    onMouseOver={(e) => handleMouseOver(e, ligne.hover, ligne.hoverDices)}
                                    onMouseOut={handleMouseOut}
                                    onClick={!isTotalRow ? () => handleClickCombi(ligne, index) : undefined}
                                >
                                    {ligne.nom}
                                </td>
                                <td
                                    className={isAlreadySelected || notHaveScore || isTotalRow ? 'scoreWithoutHover' : 'scoreWithHover'}
                                    style={isTotalRow ? {cursor: 'default'} : styleOfCombi[index]}
                                    onClick={!isTotalRow ? () => handleClickCombi(ligne, index) : undefined}
                                >
                                    {ligne.score !== -1 ? ligne.score : null}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {tooltipInfo && tooltipInfo.description != "" && (
                <div ref={tooltipRef} style={{ position: 'absolute', top: tooltipInfo.posY, left: tooltipInfo.posX, transform: 'translateX(-50%)' }} onMouseLeave={() => setTooltipInfo(null)}>
                    <CombiTooltip description={tooltipInfo.description} imageUrls={tooltipInfo.imageUrl}/>
                </div>
            )}
        </div>
    );
}

export default Tableau;