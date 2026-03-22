import './ScoreDetails.css';
import { Combi, Combinations } from '../../class/Combi';
import { useTranslation } from '../../i18n/useTranslation';

type DetailsProps = {
  closeFunction: () => void;
  playerDetails: any;
};

const getScoreClass = (score: number, max: number): string => {
  if (score === 0) return 'scoreZero';
  const ratio = score / max;
  if (ratio >= 0.7) return 'scoreHigh';
  if (ratio >= 0.35) return 'scoreMid';
  return 'scoreLow';
};

export function ScoreDetails({ closeFunction, playerDetails }: DetailsProps) {

  const { t } = useTranslation();

  const transformDetails = (playerDetails: any): Combinations => {
    let parsedData;
    if (typeof playerDetails.Details === "object") {
      parsedData = playerDetails.Details;
    } else {
      try { parsedData = JSON.parse(playerDetails.Details); }
      catch { return { simple: [], complexe: [] }; }
    }
    return { simple: parsedData.simple || [], complexe: parsedData.complexe || [] };
  };

  const { simple, complexe } = transformDetails(playerDetails);
  const allCombis = [...simple, ...complexe].filter(c => c.score > 0);
  const maxScore = allCombis.length > 0 ? Math.max(...allCombis.map(c => c.score)) : 1;

  const renderSection = (combis: Combi[], title: string) => (
    <div className="detailsSection">
      <div className="detailsSectionTitle">{title}</div>
      {combis.map((ligne, i) => (
        <div key={i} className="detailsRow">
          <span className="combiName">{ligne.nom}</span>
          <span className={`combiScore ${getScoreClass(ligne.score, maxScore)}`}>
            {ligne.score > 0 ? ligne.score : '—'}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="detailsContainer" onClick={closeFunction}>
      <div className="detailsBox" onClick={(e) => e.stopPropagation()}>

        <div className="detailsHeader">
          <img className="playerIcon" src={playerDetails['Icon']} alt="icon" />
          <div>
            <h1>{playerDetails['Nom']}</h1>
            <p className="detailsSub">{playerDetails['Date']} • {playerDetails["Duration"]}</p>
          </div>
        </div>

        <div className="totalBadge">
          <span className="totalScore">{playerDetails["Score"]}</span>
        </div>

        <div className="detailsTabs">
          {renderSection(complexe, "lower section")}
          {renderSection(simple, "upper section")}
        </div>

        <div className="detailsLegend">
          <div className="legendItem"><div className="legendDot" style={{background:'#4caf7d'}}/> {t.modals.score_details["great"]}</div>
          <div className="legendItem"><div className="legendDot" style={{background:'#f0a500'}}/> {t.modals.score_details["ok"]}</div>
          <div className="legendItem"><div className="legendDot" style={{background:'#e07070'}}/> {t.modals.score_details["low"]}</div>
          <div className="legendItem"><div className="legendDot" style={{background:'#ccc'}}/> {t.modals.score_details["none"]}</div>
        </div>

        <button className="fermerButton" onClick={closeFunction}>{t.modals.score_details["close"]}</button>
      </div>
    </div>
  );
}