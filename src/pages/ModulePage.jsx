/**
 * @file ModulePage.jsx — Single Module View
 * @description Container for a module's three streams with the StreamSwitcher.
 * Routes to the active stream component based on AppContext state.
 * Includes a progress bar showing per-stream completion.
 *
 * @module pages/ModulePage
 */
import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getModuleById, getAllModules } from '../data/modules';
import { useApp, STREAMS } from '../contexts/AppContext';
import { useSettings } from '../contexts/SettingsContext';
import { useActivityBank } from '../contexts/ActivityBankContext';
import StreamSwitcher from '../components/layout/StreamSwitcher';
import PauseButton from '../components/interactive/PauseButton';
import RouteFallback from '../components/layout/RouteFallback';
import StreamErrorBoundary from '../components/layout/StreamErrorBoundary';
import { hapticMedium } from '../utils/haptics';
import './ModulePage.css';

/**
 * Lazy registry of module stream components — one chunk per module.
 * This keeps the initial bundle minimal; each module's code only ships
 * when the learner actually opens it. Inside each chunk, the three
 * streams (Pulse/Vision/Core) are grouped together so switching streams
 * within a module is instant (no extra network round-trip).
 */
const bindLazy = (loader) => ({
  [STREAMS.PULSE]: lazy(() => loader().then((m) => ({ default: m.PulseStream }))),
  [STREAMS.VISION]: lazy(() => loader().then((m) => ({ default: m.VisionStream }))),
  [STREAMS.CORE]: lazy(() => loader().then((m) => ({ default: m.CoreStream }))),
});

const MODULE_STREAMS = {
  1: bindLazy(() => import('../modules/module1')),
  2: bindLazy(() => import('../modules/module2')),
  3: bindLazy(() => import('../modules/module3')),
  4: bindLazy(() => import('../modules/module4')),
  5: bindLazy(() => import('../modules/module5')),
  6: bindLazy(() => import('../modules/module6')),
  7: bindLazy(() => import('../modules/module7')),
  8: bindLazy(() => import('../modules/module8')),
  9: bindLazy(() => import('../modules/module9')),
  10: bindLazy(() => import('../modules/module10')),
};

/**
 * ProgressBar — Shows per-stream progress for the current module.
 * @param {Object} props
 * @param {Object} props.progress - { pulse, vision, core } progress values (0-100)
 */
function ProgressBar({ progress }) {
  const streams = [
    { key: 'pulse', label: '💓 Pulse', color: 'var(--color-pulse)' },
    { key: 'vision', label: '✨ Vision', color: 'var(--color-vision)' },
    { key: 'core', label: '🔬 Core', color: 'var(--color-core)' },
  ];

  return (
    <div className="module-page__progress" role="group" aria-label="Stream progress">
      {streams.map(({ key, label, color }) => {
        const value = progress?.[key] || 0;
        return (
          <div key={key} className="module-page__progress-item">
            <div className="module-page__progress-info">
              <span className="module-page__progress-label">{label}</span>
              <span className="module-page__progress-value">{value}%</span>
            </div>
            <div className="module-page__progress-track">
              <motion.div
                className="module-page__progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                style={{ background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ModuleNav({ currentId }) {
  const navigate = useNavigate();
  const all = getAllModules().filter((m) => m.available);
  const idx = all.findIndex((m) => m.id === currentId);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="module-page__nav">
      {prev ? (
        <motion.button
          className="module-page__nav-btn module-page__nav-btn--prev"
          onClick={() => {
            hapticMedium();
            navigate(`/modules/${prev.id}`);
          }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="module-page__nav-arrow">←</span>
          <span className="module-page__nav-info">
            <span className="module-page__nav-label">Previous</span>
            <span className="module-page__nav-title">
              {prev.icon} {prev.title}
            </span>
          </span>
        </motion.button>
      ) : (
        <div />
      )}
      {next ? (
        <motion.button
          className="module-page__nav-btn module-page__nav-btn--next"
          onClick={() => {
            hapticMedium();
            navigate(`/modules/${next.id}`);
          }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="module-page__nav-info">
            <span className="module-page__nav-label">Next</span>
            <span className="module-page__nav-title">
              {next.icon} {next.title}
            </span>
          </span>
          <span className="module-page__nav-arrow">→</span>
        </motion.button>
      ) : (
        <div />
      )}
    </div>
  );
}

/**
 * ModulePage — Renders the active stream for a single module.
 * @returns {JSX.Element}
 */
export default function ModulePage() {
  const { moduleId } = useParams();
  return <ModuleExperience key={moduleId} moduleId={moduleId} />;
}

/** Initialize one module's entry stream before mounting any stream that can save bookmarks. */
function ModuleExperience({ moduleId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeStream, currentModuleId, moduleProgress, streamChoices, setModule, setStream } =
    useApp();
  const { defaultStream } = useSettings();
  const { bookmark, resume } = useActivityBank();
  const mod = getModuleById(moduleId);
  const [entryStream] = useState(() =>
    location.state?.resume && String(bookmark?.moduleId) === moduleId
      ? bookmark.stream
      : streamChoices[moduleId] || defaultStream,
  );

  // Set current module in context
  useEffect(() => {
    if (mod) {
      setModule(mod.id);
      setStream(entryStream);
      if (location.state?.resume) resume();
      console.log(`[ModulePage] Entered Module ${mod.id}: ${mod.title}`);
    }
  }, [mod, setModule, setStream, entryStream, resume, location.state?.resume]);

  // Module not found
  if (!mod) {
    return (
      <div className="page module-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--space-10)' }}>
          <h2>Module not found</h2>
          <p>This module doesn't exist yet.</p>
          <button onClick={() => navigate('/modules')} style={{ marginTop: 'var(--space-5)' }}>
            ← Back to Modules
          </button>
        </div>
      </div>
    );
  }

  // Get the stream component
  if (currentModuleId !== mod.id) return <RouteFallback />;
  const streams = MODULE_STREAMS[mod.id];
  const StreamComponent = streams?.[activeStream];
  const progress = moduleProgress[mod.id] || {};

  return (
    <div className="page module-page">
      {/* Module Header */}
      <header className="module-page__header">
        <div className="container">
          <button
            className="module-page__back"
            onClick={() => {
              hapticMedium();
              navigate('/modules');
            }}
            aria-label="Back to modules"
          >
            ← Modules
          </button>
          <div className="module-page__title-row">
            <span className="module-page__icon">{mod.icon}</span>
            <div>
              <h1 className="module-page__title">{mod.title}</h1>
              <p className="module-page__subtitle">{mod.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container">
        <ProgressBar progress={progress} />
      </div>

      {/* Stream Switcher */}
      <div className="container">
        <StreamSwitcher />
      </div>

      {/* Stream Content — keyed entry animation keeps inactive controls unmounted */}
      <div className="module-page__content">
        <div className="container">
          <>
            {StreamComponent ? (
              <motion.div
                key={`${mod.id}-${activeStream}`}
                role={mod.id === 1 ? undefined : 'tabpanel'}
                id={mod.id === 1 ? undefined : `stream-panel-${activeStream}`}
                aria-labelledby={`stream-tab-${activeStream}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <StreamErrorBoundary key={`${mod.id}-${activeStream}`}>
                  <Suspense fallback={<RouteFallback />}>
                    <StreamComponent />
                  </Suspense>
                </StreamErrorBoundary>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="module-page__placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>✨ This stream is being built. Check back soon!</p>
                <p className="text-label">{mod.streams[activeStream]?.summary}</p>
              </motion.div>
            )}
          </>
        </div>
      </div>

      <div className="container">
        <details className="module-page__overview">
          <summary>Learning goals and vocabulary</summary>
          <ul>
            {mod.outcomes?.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
          <p>{mod.glossary?.join(' · ')}</p>
        </details>
      </div>

      {/* Pause Button */}
      <div className="container">
        <PauseButton moduleId={mod.id} />
      </div>

      {/* Module Navigation */}
      <div className="container">
        <ModuleNav currentId={mod.id} />
      </div>
    </div>
  );
}
