import Navbar from '../../components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';
import './Scores.css';
import { ScoreDetails } from '../../modals/ScoreDetails/ScoreDetails';
import { useTranslation } from '../../i18n/useTranslation';

interface PlayerScore {
  Icon: string;
  Nom: string;
  Score: number;
  Date: string;
  Duration: any;
  Details: any;
}

const ROW_CLASSES = ['row-1','row-2','row-3','row-4','row-5','row-6','row-7','row-8'];
const RANK_LABELS = ['🥇','🥈','🥉'];

export function Scores() {
  const { getScores } = YahtzeeAPI();

  const [weeklyScores,   setWeeklyScores]   = useState<PlayerScore[]>([]);
  const [lifetimeTop1,   setLifetimeTop1]   = useState<PlayerScore | null>(null);
  const [detailsOpen,    setDetailsOpen]    = useState(false);
  const [detailsIndex,   setDetailsIndex]   = useState(-1);
  const { t } = useTranslation();

  const fetchScores = async () => {
    try {
      const response = await getScores();
      if (response) {
        setWeeklyScores((response.weekly ?? []).slice(0, 15));
        setLifetimeTop1(response.lifetime?.[0] ?? null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchScores(); }, []);

  const openDetails = (index: number) => {
    setDetailsOpen(true);
    setDetailsIndex(index);
    document.body.classList.add('modal-open');
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    document.body.classList.remove('modal-open');
  };

  const rowClass = (i: number) => ROW_CLASSES[i] ?? '';
  const rankLabel = (i: number) => RANK_LABELS[i] ?? `#${i + 1}`;

  return (
    <div className="fullPage">
      <Navbar />

      <div className={`container ${detailsOpen ? 'blur-background' : ''}`}>

        {/* ── LIFETIME CHAMPION BANNER ── */}
        {lifetimeTop1 && (
          <div className="champion-banner">
            <div className="champion-crown">👑</div>
            <img src={lifetimeTop1.Icon} alt="champion" className="champion-icon" />
            <div className="champion-info">
              <div className="champion-label">{t.pages.scores["all_time_champion"]}</div>
              <div className="champion-name">{lifetimeTop1.Nom}</div>
              <div className="champion-score">{lifetimeTop1.Score} {t.pages.scores.points} · {lifetimeTop1.Date}</div>
            </div>
          </div>
        )}

        {/* ── WEEKLY SECTION ── */}
        <div className="section-header">
          <span className="section-title">{t.pages.scores["this_week"]}</span>
          <span className="section-badge">{t.pages.scores["weekly"]}</span>
        </div>

        {/* ── WEEKLY TOP 1 CARD ── */}
        {weeklyScores[0] && (
          <div className="top1-card">
            <div className="top1-rank">🥇</div>
            <img src={weeklyScores[0].Icon} alt="top1" className="top1-icon" />
            <div className="top1-info">
              <div className="top1-name">{weeklyScores[0].Nom}</div>
              <div className="top1-meta">{weeklyScores[0].Date} · {weeklyScores[0].Duration}</div>
            </div>
            <div className="top1-score-pill">{weeklyScores[0].Score}</div>
          </div>
        )}

        {/* ── TABLE ── */}
        <div className="tab">
          <table className="scoreTableau">
            {weeklyScores.length > 0 && (
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.modals.score_saving["icon"]}.</th>
                  <th>{t.modals.score_saving["name"]}</th>
                  <th>{t.modals.score_saving["score"]}</th>
                  <th>{t.pages.scores["details"]}</th>
                </tr>
              </thead>
            )}
            <tbody>
              {weeklyScores.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={5}>{t.pages.scores["no_score"]}</td>
                </tr>
              ) : (
                weeklyScores.map((player, index) => (
                  <tr key={index} className={rowClass(index)}>
                    <td><span className="rank-label">{rankLabel(index)}</span></td>
                    <td>
                      <img src={player.Icon} alt="icon" className="player-icon" />
                    </td>
                    <td style={{ fontWeight: index < 3 ? 600 : 400 }}>{player.Nom}</td>
                    <td><span className="score-value">{player.Score}</span></td>
                    <td>
                      <img
                        src="/dices/eye.png"
                        alt="details"
                        className="eye-icon"
                        onClick={() => openDetails(index)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button className="scoreButton" onClick={fetchScores}>↻ {t.pages.scores["refresh"]}</button>
      </div>

      {/* ── MODAL ── */}
      {detailsOpen && (
        <div className="modal-overlay">
          <ScoreDetails
            closeFunction={closeDetails}
            playerDetails={weeklyScores[detailsIndex]}
          />
        </div>
      )}
    </div>
  );
}