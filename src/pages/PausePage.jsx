/**
 * @file PausePage.jsx — Planned Pause / Hibernate Screen
 * @description A full-page pause experience that validates rest.
 * The user can see their bookmark and resume when ready.
 * 
 * @module pages/PausePage
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityBank } from '../contexts/ActivityBankContext';
import { getModuleById } from '../data/modules';
import PauseButton from '../components/interactive/PauseButton';
import './PausePage.css';

/**
 * PausePage — Full-screen rest/pause experience.
 * @returns {JSX.Element}
 */
export default function PausePage() {
  const navigate = useNavigate();
  const { isPaused, bookmark, pausedAt } = useActivityBank();
  const bookmarkedModule = bookmark ? getModuleById(bookmark.moduleId) : null;

  return (
    <div className="page pause-page">
      <div className="container">
        <motion.div
          className="pause-page__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pause-page__moon">🌙</div>
          <h1>Your Orbit Pauses</h1>
          <p>
            Rest is not stopping. It's what lets the inference continue 
            beneath the surface.
          </p>

          {/* Bookmark */}
          {bookmarkedModule && (
            <motion.div
              className="pause-page__bookmark glass"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="pause-page__bookmark-icon">{bookmarkedModule.icon}</span>
              <div className="pause-page__bookmark-info">
                <span className="pause-page__bookmark-label">Your place is held</span>
                <span className="pause-page__bookmark-title">{bookmarkedModule.title}</span>
                {bookmark.stream && (
                  <span className="pause-page__bookmark-stream">
                    {bookmark.stream.charAt(0).toUpperCase() + bookmark.stream.slice(1)} stream
                  </span>
                )}
              </div>
              <button
                className="pause-page__resume-link"
                onClick={() => navigate(`/modules/${bookmarkedModule.id}`)}
              >
                Resume →
              </button>
            </motion.div>
          )}

          {/* Pause time */}
          {isPaused && pausedAt && (
            <p className="pause-page__since">
              Paused since {new Date(pausedAt).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}

          <PauseButton />
        </motion.div>
      </div>
    </div>
  );
}
