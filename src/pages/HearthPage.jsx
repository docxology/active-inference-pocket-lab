/**
 * @file HearthPage.jsx — Community Celebration Space
 * @description Replaces the 'Arena' (leaderboards) with the 'Hearth.'
 * Celebrates clarity, support, and 'Good Questions.'
 * Uses animations as emotional rewards for consistency (the 'Spin').
 * 
 * @module pages/HearthPage
 */
import { motion } from 'framer-motion';
import { useActivityBank } from '../contexts/ActivityBankContext';
import './HearthPage.css';

/**
 * HearthPage — Community/achievement celebration space.
 * @returns {JSX.Element}
 */
export default function HearthPage() {
  const { totalMinutes, sessions, currentStreak } = useActivityBank();

  return (
    <div className="page hearth-page">
      <div className="container">
        <motion.header
          className="hearth-page__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>The Hearth</h1>
          <p>Warmth, not competition. Celebrate your journey.</p>
        </motion.header>

        {/* Flame */}
        <motion.div
          className="hearth-page__flame"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔥
        </motion.div>

        {/* Stats */}
        <div className="hearth-page__stats">
          <motion.div className="hearth-page__stat glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="hearth-page__stat-value">{totalMinutes}</span>
            <span className="hearth-page__stat-label">Minutes of Active Learning</span>
          </motion.div>
          <motion.div className="hearth-page__stat glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="hearth-page__stat-value">{sessions.length}</span>
            <span className="hearth-page__stat-label">Sessions Completed</span>
          </motion.div>
          <motion.div className="hearth-page__stat glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span className="hearth-page__stat-value">{currentStreak}</span>
            <span className="hearth-page__stat-label">Day Streak (Spins)</span>
          </motion.div>
        </div>

        {/* Good Questions */}
        <motion.section
          className="hearth-page__section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Good Questions</h2>
          <p className="hearth-page__section-desc">
            Questions that led to clarity are celebrated here.
          </p>
          <div className="hearth-page__empty-state">
            <p>✨ Your good questions will appear here as you explore the modules.</p>
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section
          className="hearth-page__section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2>Clarity Badges</h2>
          <div className="hearth-page__badges">
            <div className={`hearth-page__badge ${sessions.length > 0 ? 'earned' : ''}`}>
              <span className="hearth-page__badge-icon">🌀</span>
              <span className="hearth-page__badge-label">First Spin</span>
            </div>
            <div className={`hearth-page__badge ${totalMinutes >= 10 ? 'earned' : ''}`}>
              <span className="hearth-page__badge-icon">⏱️</span>
              <span className="hearth-page__badge-label">10 Minutes</span>
            </div>
            <div className={`hearth-page__badge ${currentStreak >= 3 ? 'earned' : ''}`}>
              <span className="hearth-page__badge-icon">🔥</span>
              <span className="hearth-page__badge-label">3-Day Streak</span>
            </div>
            {/* TODO: Add more badges as modules are completed */}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
