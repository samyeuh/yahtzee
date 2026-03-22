import './SettingsModal.css';
import { useYahtzeeContext } from '../../context/YahtzeeContext/YahtzeeContext';
import { BG_COLORS } from '../../hooks/useSettings';
import { useTranslation } from '../../i18n/useTranslation';

type SettingsModalProps = {
  closeFunction: () => void;
};

export function SettingsModal({ closeFunction }: SettingsModalProps) {
  const { settings, updateSetting } = useYahtzeeContext();
  const { t } = useTranslation();

  return (
    <div className="settings-overlay" onClick={closeFunction}>
      <div className="settings-box" onClick={e => e.stopPropagation()}>

        <div className="settings-header">
          <span className="settings-title">settings</span>
          <button className="settings-close" onClick={closeFunction}>✕</button>
        </div>

        {/* ── SOUND ── */}
        <div className="settings-section">
          <div className="settings-section-label">🔊 {t.modals.settings["sound"]}</div>

          <div className="settings-row">
            <span className="settings-label">{t.modals.settings["mute"]}</span>
            <button
              className={`settings-toggle ${settings.muted ? 'active' : ''}`}
              onClick={() => updateSetting('muted', !settings.muted)}
            >
              {settings.muted ? 'on' : 'off'}
            </button>
          </div>

          <div className="settings-row">
            <span className="settings-label">{t.modals.settings["volume"]}</span>
            <div className="settings-slider-wrapper">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.volume}
                disabled={settings.muted}
                onChange={e => updateSetting('volume', parseFloat(e.target.value))}
                className="settings-slider"
              />
              <span className="settings-slider-value">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* ── THEME ── */}
        <div className="settings-section">
        <div className="settings-section-label">🎨 {t.modals.settings["background"]}</div>
        <div className="settings-row">
            <span className="settings-label">{t.modals.settings["color"]}</span>
            <div className="settings-colors">
            {BG_COLORS.map(color => (
                <button
                key={color.value}
                className={`settings-color-swatch ${settings.bgColor === color.value ? 'active' : ''}`}
                style={{ background: color.value }}
                onClick={() => updateSetting('bgColor', color.value)}
                title={color.label}
                />
            ))}
            </div>
        </div>
        </div>

        {/* ── LANGUAGE ── */}
        <div className="settings-section">
          <div className="settings-section-label">🌍 {t.modals.settings["language"]}</div>
          <div className="settings-row">
            <span className="settings-label">{t.modals.settings["lang"]}</span>
            <div className="settings-segmented">
              <button
                className={`settings-seg-btn ${settings.language === 'en' ? 'active' : ''}`}
                onClick={() => updateSetting('language', 'en')}
              >
                EN
              </button>
              <button
                className={`settings-seg-btn ${settings.language === 'fr' ? 'active' : ''}`}
                onClick={() => updateSetting('language', 'fr')}
              >
                FR
              </button>
            </div>
          </div>
        </div>

        {/* ── DEFAULT NAME ── */}
        <div className="settings-section">
          <div className="settings-section-label">✏️ {t.modals.settings["default_name"]}</div>
          <div className="settings-row">
            <span className="settings-label">{t.modals.settings["name"]}</span>
            <input
              type="text"
              className="settings-input"
              maxLength={11}
              placeholder={t.modals.score_saving["name_placeholder"]}
              value={settings.defaultName}
              onChange={e => updateSetting('defaultName', e.target.value)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}