/**
 * @file ModuleListPage.jsx — Module Catalog
 * @description Displays all 10 modules as cards with progress indicators.
 * Visible Pathing: every user sees exactly what is required.
 *
 * @module pages/ModuleListPage
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllModules } from '../data/modules';
import { useApp } from '../contexts/AppContext';
import './ModuleListPage.css';

/**
 * ModuleListPage — Grid of all 10 module cards.
 * @returns {JSX.Element}
 */
export default function ModuleListPage() {
  const navigate = useNavigate();
  const modules = getAllModules();
  const { moduleProgress } = useApp();

  return (
    <div className="page module-list-page">
      <div className="container">
        <header className="module-list-page__header">
          <h1>Modules</h1>
          <p>Ten orbits through Active Inference. Start anywhere.</p>
        </header>

        <div className="module-list-page__grid">
          {modules.map((mod, i) => {
            const progress = moduleProgress[mod.id] || {};
            const totalProgress = Math.round(
              ((progress.pulse || 0) + (progress.vision || 0) + (progress.core || 0)) / 3,
            );

            return (
              <motion.button
                key={mod.id}
                className={`module-card glass ${!mod.available ? 'locked' : ''}`}
                onClick={() => mod.available && navigate(`/modules/${mod.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={mod.available ? { scale: 0.97 } : {}}
                disabled={!mod.available}
                aria-label={`${mod.title}${!mod.available ? ' (coming soon)' : ''}`}
              >
                <div className="module-card__header">
                  <span className="module-card__number">{String(mod.id).padStart(2, '0')}</span>
                  <span className="module-card__icon">{mod.icon}</span>
                </div>
                <h3 className="module-card__title">{mod.title}</h3>
                <p className="module-card__subtitle">{mod.subtitle}</p>
                <p className="module-card__description">{mod.description}</p>

                {/* Progress bar */}
                {mod.available && (
                  <div className="module-card__progress">
                    <div className="module-card__progress-bar">
                      <div
                        className="module-card__progress-fill"
                        style={{ width: `${totalProgress}%` }}
                      />
                    </div>
                    <span className="module-card__progress-text">{totalProgress}%</span>
                  </div>
                )}

                {!mod.available && <span className="module-card__coming-soon">Coming Soon</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
