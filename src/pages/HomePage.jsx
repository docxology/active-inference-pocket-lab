/**
 * @file HomePage.jsx — Landing / Home Page
 * @description The first screen users see. Introduces Spin and provides
 * quick access to resume or begin a module.
 *
 * @module pages/HomePage
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityBank } from '../contexts/ActivityBankContext';
import { getModuleById } from '../data/modules';
import './HomePage.css';

/**
 * HomePage — Welcome screen with resume capability.
 * @returns {JSX.Element}
 */
export default function HomePage() {
  const navigate = useNavigate();
  const { bookmark, totalMinutes, currentStreak } = useActivityBank();
  const bookmarkedModule = bookmark ? getModuleById(bookmark.moduleId) : null;

  return (
    <div className="page home-page">
      <div className="container">
        {/* Hero */}
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
            Learn by doing. Move sliders. Adjust variables.
            <br />
            Your brain is already doing Active Inference.
          </p>
        </motion.div>

        {/* Resume Card */}
        {bookmarkedModule && (
          <motion.button
            className="home-page__resume glass"
            onClick={() => navigate(`/modules/${bookmarkedModule.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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

        {/* Quick Start */}
        <motion.button
          className="home-page__start"
          onClick={() => navigate('/modules/1')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin The First Orbit 🌀
        </motion.button>

        {/* Stats */}
        <motion.div
          className="home-page__stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="home-page__stat">
            <span className="home-page__stat-value">{totalMinutes}</span>
            <span className="home-page__stat-label">Minutes Active</span>
          </div>
          <div className="home-page__stat">
            <span className="home-page__stat-value">{currentStreak}</span>
            <span className="home-page__stat-label">Day Streak</span>
          </div>
          <div className="home-page__stat">
            <span className="home-page__stat-value">10</span>
            <span className="home-page__stat-label">Modules</span>
          </div>
        </motion.div>

        {/* Philosophy Quote */}
        <motion.blockquote
          className="home-page__quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>"You are an architect of a world in formation."</p>
        </motion.blockquote>
      </div>
    </div>
  );
}
