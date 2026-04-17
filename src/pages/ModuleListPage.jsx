/**
 * @file ModuleListPage.jsx — Module Catalog
 * @description All 10 modules with richer metadata: per-stream progress pips,
 * tag filter, quick-outcome bullets, and estimated minutes. Visible pathing,
 * no hidden gates.
 *
 * @module pages/ModuleListPage
 */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllModules } from '../data/modules';
import { useApp } from '../contexts/AppContext';
import './ModuleListPage.css';

function collectTags(mods) {
  const s = new Set();
  for (const m of mods) (m.tags || []).forEach((t) => s.add(t));
  return ['all', ...Array.from(s).sort()];
}

function StreamPip({ color, value }) {
  return (
    <span className="module-card__pip" title={`${value}%`}>
      <span className="module-card__pip-track">
        <span className="module-card__pip-fill" style={{ width: `${value}%`, background: color }} />
      </span>
    </span>
  );
}

export default function ModuleListPage() {
  const navigate = useNavigate();
  const modules = getAllModules();
  const { moduleProgress } = useApp();
  const [activeTag, setActiveTag] = useState('all');
  const tags = useMemo(() => collectTags(modules), [modules]);
  const filtered = useMemo(
    () =>
      activeTag === 'all' ? modules : modules.filter((m) => (m.tags || []).includes(activeTag)),
    [modules, activeTag],
  );

  return (
    <div className="page module-list-page">
      <div className="container">
        <header className="module-list-page__header">
          <h1>Modules</h1>
          <p>
            Ten orbits through Active Inference. Each has three streams — pick what suits your day.
          </p>
        </header>

        <div className="module-list-page__filters" role="tablist" aria-label="Filter by topic">
          {tags.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={activeTag === t}
              className={`module-list-page__tag${activeTag === t ? ' is-active' : ''}`}
              onClick={() => setActiveTag(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="module-list-page__grid">
          {filtered.map((mod, i) => {
            const progress = moduleProgress[mod.id] || {};
            const p = progress.pulse || 0;
            const v = progress.vision || 0;
            const c = progress.core || 0;
            const totalProgress = Math.round((p + v + c) / 3);
            const started = totalProgress > 0;
            const done = totalProgress >= 100;

            return (
              <motion.button
                key={mod.id}
                className={`module-card glass ${!mod.available ? 'locked' : ''}${done ? ' is-done' : ''}${started ? ' is-started' : ''}`}
                onClick={() => mod.available && navigate(`/modules/${mod.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={mod.available ? { scale: 0.97 } : {}}
                disabled={!mod.available}
                aria-label={`${mod.title}${!mod.available ? ' (coming soon)' : ''}`}
              >
                <div className="module-card__header">
                  <span className="module-card__number">{String(mod.id).padStart(2, '0')}</span>
                  <span className="module-card__icon">{mod.icon}</span>
                  {mod.minutes && <span className="module-card__minutes">{mod.minutes} min</span>}
                </div>
                <h3 className="module-card__title">{mod.title}</h3>
                <p className="module-card__subtitle">{mod.subtitle}</p>
                <p className="module-card__description">{mod.description}</p>

                {Array.isArray(mod.outcomes) && mod.outcomes.length > 0 && (
                  <ul className="module-card__outcomes">
                    {mod.outcomes.slice(0, 2).map((o, j) => (
                      <li key={j}>{o}</li>
                    ))}
                  </ul>
                )}

                {mod.available && (
                  <div className="module-card__progress" aria-label="Stream progress">
                    <div className="module-card__pips">
                      <StreamPip color="var(--color-pulse, #ff5d9e)" value={p} />
                      <StreamPip color="var(--color-vision, #8bb4ff)" value={v} />
                      <StreamPip color="var(--color-core, #7ad7c8)" value={c} />
                    </div>
                    <span className="module-card__progress-text">{totalProgress}%</span>
                  </div>
                )}

                {!mod.available && <span className="module-card__coming-soon">Coming soon</span>}
                {done && (
                  <span className="module-card__badge" aria-hidden>
                    🏅
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
