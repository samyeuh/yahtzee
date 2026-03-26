import './Login.css';
import { useEffect, useRef, useState } from 'react';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingPage } from '../LoadingPage/LoadingPage';
import { YahtzeeAPI } from '../../api/YahtzeeAPI';
import changelog from '../../assets/utils/changelog.json';
import { SettingsModal } from '../../modals/SettingsModal/SettingsModal';
import { useTranslation } from '../../i18n/useTranslation';

export function Login() {
  const { setRoundActive, setGameActive, setScore, loading, setLoading, yahtzeeLogic } = useYahtzeeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [handleFadeComplete, setHandleFadeComplete] = useState<(() => void) | null>(null);
  const [waitServer, setWaitServer] = useState<boolean>(false);
  const [trophyDisabled, setTrophyDisabled] = useState<boolean>(true);
  const [showChangelog, setShowChangelog] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { t } = useTranslation();

  const popoverRef = useRef<HTMLDivElement>(null);
  const { testSupabase } = YahtzeeAPI();

  useEffect(() => { whenLoading(); }, []);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') navigate('/');
  }, [location]);

  useEffect(() => {
    const checkSupabase = async () => {
      const status = await testSupabase();
      setTrophyDisabled(status !== 200);
    };
    checkSupabase();
  }, []);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowChangelog(false);
      }
    };
    if (showChangelog) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showChangelog]);

  const whenLoading = async () => {
    try {
      yahtzeeLogic.restartGame();
      setScore(0);
    } catch (error) {
      console.error("Erreur: " + error);
    }
  };

  const startGame = async (): Promise<void> => {
    loadSounds();
    setHandleFadeComplete(() => startFadeComplete);
    setWaitServer(false);
    setLoading(true);
  };

  const loadSounds = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    ctx.resume();
  };

  const startFadeComplete = () => {
    setGameActive(true);
    setRoundActive(true);
    navigate('/play');
    setLoading(false);
  };

  const openGithub = () => window.open('https://github.com/samyeuh/yahtzee');

  const openTrophy = () => {
    if (trophyDisabled) return;
    setHandleFadeComplete(() => trophyFadeComplete);
    setWaitServer(true);
    setLoading(true);
  };

  const trophyFadeComplete = () => navigate('/scores');

  const typeEmoji = (type: string) => {
    if (type === 'new') return '✨';
    if (type === 'improved') return '⚡';
    if (type === 'fix') return '🐛';
    return '•';
  };

  if (loading) {
    return <LoadingPage onFadeComplete={handleFadeComplete} waitServer={waitServer} />;
  }

  return (
    <>
      <div className="fullpage">
        <img src="/logo/yahtzee.png" onClick={startGame} className='start-icon' alt="start button" />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
          <img src={trophyDisabled ? "/dices/trophy_disabled.png" : "/dices/trophy.png"} onClick={openTrophy} className='other-icon' alt="trophy" />
          <img src="/dices/github.png" onClick={openGithub} className='other-icon' alt="github link" />
          <img src="/dices/settings.png" onClick={() => setSettingsOpen(true)} className='other-icon' alt="github link" />
        </div>

        {/* ── VERSION BADGE ── */}
        <div className="version-wrapper" ref={popoverRef}>
          <button
            className="version-badge"
            onClick={() => setShowChangelog(prev => !prev)}
          >
            v{changelog.version}
          </button>

          {/* ── CHANGELOG POPOVER ── */}
          {showChangelog && (
            <div className="changelog-popover">
              <div className="changelog-header">
                <span className="changelog-title">{t.pages.login["whats_new"]}</span>
                <span className="changelog-version">v{changelog.version}</span>
              </div>
              <ul className="changelog-list">
                {changelog.entries.map((entry, i) => (
                  <li key={i} className={`changelog-entry changelog-${entry.type}`}>
                    <span className="changelog-emoji">{typeEmoji(entry.type)}</span>
                    <span>{entry.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {settingsOpen && (
            <SettingsModal closeFunction={() => setSettingsOpen(false)} />
          )}
        </div>
      </div>
    </>
  );
}