/**
 * @file ModulePage.jsx — Single Module View
 * @description Container for a module's three streams with the StreamSwitcher.
 * Routes to the active stream component based on AppContext state.
 * Includes a progress bar showing per-stream completion.
 *
 * @module pages/ModulePage
 */
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getModuleById } from '../data/modules';
import { useApp, STREAMS } from '../contexts/AppContext';
import StreamSwitcher from '../components/layout/StreamSwitcher';
import PauseButton from '../components/interactive/PauseButton';
import { PulseStream, VisionStream, CoreStream } from '../modules/module1';
import { hapticMedium } from '../utils/haptics';
import './ModulePage.css';

/**
 * Map of module IDs to their stream components.
 * TODO: Expand as Modules 2-10 are implemented.
 */
const MODULE_STREAMS = {
  1: {
    [STREAMS.PULSE]: PulseStream,
    [STREAMS.VISION]: VisionStream,
    [STREAMS.CORE]: CoreStream,
  },
  // Modules 2-10: Add stream components here as they are built
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
                <StreamComponent />
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
