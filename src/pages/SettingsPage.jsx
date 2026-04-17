/**
 * @file SettingsPage.jsx — User preferences
 * @description Controls for accessibility, haptics, sound, and defaults.
 * All values flow through SettingsContext and persist to localStorage.
 * @module pages/SettingsPage
 */
import { useSettings } from '../contexts/SettingsContext';
import { useApp } from '../contexts/AppContext';
import './SettingsPage.css';

function Row({ label, hint, children }) {
  return (
    <div className="settings-page__row">
      <div>
        <div className="settings-page__label">{label}</div>
        {hint && <div className="settings-page__hint">{hint}</div>}
      </div>
      <div className="settings-page__control">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="settings-page__toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span className="settings-page__toggle-track" aria-hidden>
        <span className="settings-page__toggle-thumb" />
      </span>
    </label>
  );
}

const FONT_OPTIONS = [
  { value: 0.9, label: 'Cozy' },
  { value: 1.0, label: 'Default' },
  { value: 1.1, label: 'Large' },
  { value: 1.25, label: 'X-Large' },
];

const STREAM_OPTIONS = [
  { value: 'pulse', label: '💓 Pulse' },
  { value: 'vision', label: '✨ Vision' },
  { value: 'core', label: '🔬 Core' },
];

export default function SettingsPage() {
  const s = useSettings();
  const { resetApp } = useApp() || {};

  return (
    <div className="page settings-page">
      <div className="container">
        <header className="settings-page__header">
          <h1>Settings</h1>
          <p>Tune the experience. Values persist on this device.</p>
        </header>

        <section className="settings-page__section">
          <h2>Access</h2>
          <Row
            label="Reduced motion"
            hint="Minimize animations. Useful for vestibular sensitivity."
          >
            <Toggle checked={s.reducedMotion} onChange={(v) => s.set({ reducedMotion: v })} label="Reduced motion" />
          </Row>
          <Row label="High contrast" hint="Increase color contrast for readability.">
            <Toggle checked={s.highContrast} onChange={(v) => s.set({ highContrast: v })} label="High contrast" />
          </Row>
          <Row label="Font size" hint="Scales typography app-wide.">
            <div className="settings-page__seg">
              {FONT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  className={`settings-page__seg-btn${s.fontScale === o.value ? ' is-active' : ''}`}
                  onClick={() => s.set({ fontScale: o.value })}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Row>
        </section>

        <section className="settings-page__section">
          <h2>Feedback</h2>
          <Row label="Haptics" hint="Short vibrations on progress and milestones.">
            <Toggle checked={s.haptics} onChange={(v) => s.set({ haptics: v })} label="Haptics" />
          </Row>
          <Row label="Sound" hint="Subtle cues on completion (off by default).">
            <Toggle checked={s.sound} onChange={(v) => s.set({ sound: v })} label="Sound" />
          </Row>
        </section>

        <section className="settings-page__section">
          <h2>Learning</h2>
          <Row label="Default stream" hint="Which mode opens first when you enter a module.">
            <div className="settings-page__seg">
              {STREAM_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  className={`settings-page__seg-btn${s.defaultStream === o.value ? ' is-active' : ''}`}
                  onClick={() => s.set({ defaultStream: o.value })}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Row>
          <Row label="Show math by default" hint="Expand equations instead of collapsing them.">
            <Toggle checked={s.showMathByDefault} onChange={(v) => s.set({ showMathByDefault: v })} label="Show math" />
          </Row>
          <Row label="Auto-bookmark" hint="Remember where you left off inside each module.">
            <Toggle checked={s.autoBookmark} onChange={(v) => s.set({ autoBookmark: v })} label="Auto-bookmark" />
          </Row>
        </section>

        <section className="settings-page__section settings-page__section--danger">
          <h2>Danger zone</h2>
          <Row label="Reset settings" hint="Restore defaults on this device.">
            <button className="settings-page__danger" onClick={() => s.reset()}>Reset</button>
          </Row>
          {resetApp && (
            <Row
              label="Clear all progress"
              hint="Wipes module progress, activity bank, and bookmarks. Irreversible."
            >
              <button
                className="settings-page__danger"
                onClick={() => {
                  if (confirm('Clear all progress? This cannot be undone.')) resetApp();
                }}
              >
                Clear progress
              </button>
            </Row>
          )}
        </section>

        <footer className="settings-page__foot">
          <p>Built for alignment and flourishing. No accounts. No servers. Just your browser.</p>
        </footer>
      </div>
    </div>
  );
}
