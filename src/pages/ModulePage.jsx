/**
 * @file ModulePage.jsx — Single Module View
 * @description Container for a module's three streams with the StreamSwitcher.
 * Routes to the active stream component based on AppContext state.
 * Includes a progress bar showing per-stream completion.
 *
 * @module pages/ModulePage
 */
import { lazy, Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getModuleById } from '../data/modules';
import { useApp, STREAMS } from '../contexts/AppContext';
import StreamSwitcher from '../components/layout/StreamSwitcher';
import PauseButton from '../components/interactive/PauseButton';
import RouteFallback from '../components/layout/RouteFallback';
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

/**
 * ModulePage — Renders the active stream for a single module.
 * @returns {JSX.Element}
 */
export default function ModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { activeStream, moduleProgress, setModule } = useApp();
  const mod = getModuleById(moduleId);

  // Set current module in context
  useEffect(() => {
    if (mod) {
      setModule(mod.id);
      console.log(`[ModulePage] Entered Module ${mod.id}: ${mod.title}`);
    }
  }, [mod, setModule]);

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

      {/* Overview */}
      {(mod.outcomes?.length > 0 || mod.glossary?.length > 0) && (
        <div className="container">
          <section className="module-page__overview" aria-label="Module overview">
            {mod.outcomes?.length > 0 && (
              <div className="module-page__overview-card">
                <h3>You'll leave able to…</h3>
                <ul>
                  {mod.outcomes.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            )}
            {mod.glossary?.length > 0 && (
              <div className="module-page__overview-card">
                <h3>Vocabulary lit up</h3>
                <div className="module-page__overview-tags">
                  {mod.glossary.map((g) => (
                    <span key={g} className="module-page__overview-tag">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Stream Switcher */}
      <div className="container">
        <StreamSwitcher />
      </div>

      {/* Stream Content — AnimatePresence for smooth transitions */}
      <div className="module-page__content">
        <div className="container">
          <AnimatePresence mode="wait">
            {StreamComponent ? (
              <motion.div
                key={activeStream}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Suspense fallback={<RouteFallback />}>
                  <StreamComponent />
                </Suspense>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="module-page__placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>✨ This stream is being built. Check back soon!</p>
                <p className="text-label">{mod.streams[activeStream]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pause Button */}
      <div className="container">
        <PauseButton moduleId={mod.id} />
      </div>
    </div>
  );
}
