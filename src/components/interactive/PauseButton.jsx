/**
 * @file PauseButton.jsx — Validated Rest Button
 * @description Celebrates the user's need to step away.
 * Saves a bookmark and displays warm, non-judgmental messaging.
 *
 * Philosophy: "Seasonal Rhythms" — No penalties for rest.
 * The interface holds your place like a bookmark in a heavy stone book.
 *
 * @module components/interactive/PauseButton
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivityBank } from '../../contexts/ActivityBankContext';
import { useApp } from '../../contexts/AppContext';
import './PauseButton.css';

/** Warm messages that validate stepping away */
const PAUSE_MESSAGES = [
  'Your orbit continues when you return. 🌙',
  'Rest is part of the process. See you soon. ✨',
  'The world outside is also a generative model. 🌿',
  'Your place is held. Go be in the world. 🌊',
  'Inference paused. Inference never stops in you. 🧠',
  'The hearth keeps warm for your return. 🔥',
];

/**
 * PauseButton — Validates rest and bookmarks progress.
 *
 * @param {Object} props
 * @param {string} [props.moduleId] - Current module to bookmark
 * @param {string} [props.position] - Current position in the module
 * @returns {JSX.Element}
 */
export default function PauseButton({ moduleId, position }) {
  const { isPaused, pause, resume, setBookmark } = useActivityBank();
  const { activeStream } = useApp();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  const handlePause = () => {
    if (isPaused) {
      resume();
      setShowMessage(false);
      console.log('[PauseButton] Resumed');
    } else {
      // Save bookmark
      if (moduleId) {
        setBookmark(moduleId, activeStream, position || 'start');
      }
      pause();

      // Select a warm message
      const msg = PAUSE_MESSAGES[Math.floor(Math.random() * PAUSE_MESSAGES.length)];
      setMessage(msg);
      setShowMessage(true);
      console.log('[PauseButton] Paused with message:', msg);
    }
  };

  return (
    <div className="pause-button-container">
      <motion.button
        id="pause-button"
        className={`pause-button ${isPaused ? 'paused' : ''}`}
        onClick={handlePause}
        whileTap={{ scale: 0.95 }}
        aria-label={isPaused ? 'Resume learning' : 'Pause and rest'}
      >
        <span className="pause-button__icon">{isPaused ? '☀️' : '🌙'}</span>
        <span className="pause-button__text">
          {isPaused ? 'Resume Your Orbit' : 'Take a Pause'}
        </span>
      </motion.button>

      <AnimatePresence>
        {showMessage && isPaused && (
          <motion.p
            className="pause-button__message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
