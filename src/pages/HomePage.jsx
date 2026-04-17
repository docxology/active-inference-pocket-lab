/**
 * @file HomePage.jsx — Landing / Home Page
 * @description First screen: hero, resume, next-up module, overall progress,
 * quick tiles, and a philosophy anchor. Designed to respect where a user is
 * in their journey and point naturally to the next meaningful action.
 *
 * @module pages/HomePage
 */
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityBank } from '../contexts/ActivityBankContext';
import { useApp } from '../contexts/AppContext';
import { getModuleById, modules } from '../data/modules';
import './HomePage.css';

function findNextModule(moduleProgress) {
  for (const m of modules) {
    const mp = moduleProgress[m.id] || {};
    const avg = ((mp.pulse || 0) + (mp.vision || 0) + (mp.core || 0)) / 3;
    if (avg < 100) return { mod: m, avg };
  }
  return { mod: modules[modules.length - 1], avg: 100 };
}

export default function HomePage() {
  const navigate = useNavigate();
  const { bookmark, totalMinutes, currentStreak } = useActivityBank();
  const { moduleProgress, getOverallProgress } = useApp();
  const bookmarkedModule = bookmark ? getModuleById(bookmark.moduleId) : null;
  const next = useMemo(() => findNextModule(moduleProgress), [moduleProgress]);
  const overall = getOverallProgress?.() || 0;
  const hasStarted = Object.keys(moduleProgress || {}).length > 0;

  return (
    <div className="page home-page">
      <div className="container">
        <motion.div
          className="home-page__hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="home-page__logo" aria-hidden="true">
            🌀
          </div>
          <h1 className="home-page__title">Spin</h1>
          <p className="home-page__subtitle">The Active Inference Pocket Lab</p>
          <p className="home-page__tagline">
            Learn by doing. Move sliders. Watch your brain think out loud.
          </p>
        </motion.div>

        {bookmarkedModule && (
          <motion.button
            className="home-page__resume glass"
            onClick={() => navigate(`/modules/${bookmarkedModule.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="home-page__resume-icon">{bookmarkedModule.icon}</span>
            <div className="home-page__resume-info">
              <span className="home-page__resume-label">Continue where you left off</span>
              <span className="home-page__resume-title">{bookmarkedModule.title}</span>
            </div>
            <span className="home-page__resume-arrow">→</span>
          </motion.button>
        )}

        <motion.div
          className="home-page__next glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="home-page__next-head">
            <span className="home-page__next-eyebrow">{hasStarted ? 'Up next' : 'Start here'}</span>
            <span className="home-page__next-pct">{Math.round(next.avg)}%</span>
          </div>
          <Link to={`/modules/${next.mod.id}`} className="home-page__next-card">
            <span className="home-page__next-icon">{next.mod.icon}</span>
            <div>
              <strong>{next.mod.title}</strong>
              <small>{next.mod.subtitle}</small>
            </div>
            <span className="home-page__next-arrow" aria-hidden>
              →
            </span>
          </Link>
          <div className="home-page__overall">
            <div className="home-page__overall-track">
              <div className="home-page__overall-fill" style={{ width: `${overall}%` }} />
            </div>
            <small>{overall}% of the full orbit</small>
          </div>
        </motion.div>

        <motion.div
          className="home-page__stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="home-page__stat">
            <span className="home-page__stat-value">{totalMinutes}</span>
            <span className="home-page__stat-label">Minutes active</span>
          </div>
          <div className="home-page__stat">
            <span className="home-page__stat-value">{currentStreak}</span>
            <span className="home-page__stat-label">Day streak</span>
          </div>
          <div className="home-page__stat">
            <span className="home-page__stat-value">{overall}%</span>
            <span className="home-page__stat-label">Overall</span>
          </div>
        </motion.div>

        <motion.nav
          aria-label="Quick links"
          className="home-page__tiles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/modules" className="home-page__tile">
            <span aria-hidden>📚</span>
            <strong>All modules</strong>
            <small>The 10-chapter journey</small>
          </Link>
          <Link to="/map" className="home-page__tile">
            <span aria-hidden>🗺️</span>
            <strong>Proficiency map</strong>
            <small>What you know, at a glance</small>
          </Link>
          <Link to="/glossary" className="home-page__tile">
            <span aria-hidden>📖</span>
            <strong>Glossary</strong>
            <small>Every term, linked</small>
          </Link>
          <Link to="/hearth" className="home-page__tile">
            <span aria-hidden>🔥</span>
            <strong>Hearth</strong>
            <small>Your journey, celebrated</small>
          </Link>
          <Link to="/search" className="home-page__tile">
            <span aria-hidden>🔎</span>
            <strong>Search</strong>
            <small>Jump anywhere</small>
          </Link>
          <Link to="/pause" className="home-page__tile">
            <span aria-hidden>🌙</span>
            <strong>Pause</strong>
            <small>Honor the rhythm</small>
          </Link>
        </motion.nav>

        <motion.blockquote
          className="home-page__quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>"You are an architect of a world in formation."</p>
        </motion.blockquote>
      </div>
    </div>
  );
}
