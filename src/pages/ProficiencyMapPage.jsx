/**
 * @file ProficiencyMapPage.jsx — Visible Pathing
 * @description Visual map showing progress across all 10 modules × 3 streams.
 * Clear thresholds: what's needed to reach the next level.
 * No hidden requirements.
 *
 * @module pages/ProficiencyMapPage
 */
import { motion } from 'framer-motion';
import { getAllModules } from '../data/modules';
import { useApp, STREAMS } from '../contexts/AppContext';
import './ProficiencyMapPage.css';

const STREAM_META = [
  { key: STREAMS.PULSE, label: 'Pulse', color: 'var(--color-pulse)' },
  { key: STREAMS.VISION, label: 'Vision', color: 'var(--color-vision)' },
  { key: STREAMS.CORE, label: 'Core', color: 'var(--color-core)' },
];

/**
 * ProficiencyMapPage — Visual progress map.
 * @returns {JSX.Element}
 */
export default function ProficiencyMapPage() {
  const modules = getAllModules();
  const { moduleProgress } = useApp();

  return (
    <div className="page proficiency-map-page">
      <div className="container">
        <header className="proficiency-map-page__header">
          <h1>Proficiency Map</h1>
          <p>Your orbit through Active Inference. No hidden requirements.</p>
        </header>

        {/* Legend */}
        <div className="proficiency-map-page__legend">
          {STREAM_META.map((s) => (
            <div key={s.key} className="proficiency-map-page__legend-item">
              <span className="proficiency-map-page__legend-dot" style={{ background: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Map Grid */}
        <div className="proficiency-map-page__grid">
          {modules.map((mod, i) => {
            const progress = moduleProgress[mod.id] || {};

            return (
              <motion.div
                key={mod.id}
                className={`proficiency-map-page__module ${!mod.available ? 'locked' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="proficiency-map-page__module-header">
                  <span className="proficiency-map-page__module-icon">{mod.icon}</span>
                  <span className="proficiency-map-page__module-number">
                    {String(mod.id).padStart(2, '0')}
                  </span>
                </div>
                <span className="proficiency-map-page__module-title">{mod.title}</span>

                {/* Stream progress bars */}
                <div className="proficiency-map-page__streams">
                  {STREAM_META.map((s) => (
                    <div key={s.key} className="proficiency-map-page__stream-bar">
                      <div
                        className="proficiency-map-page__stream-fill"
                        style={{
                          width: `${progress[s.key] || 0}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
