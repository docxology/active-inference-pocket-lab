/**
 * @file StreamSwitcher.jsx — Triple-Stream Selector
 * @description Segmented control for switching between Pulse, Vision, and Core streams.
 * Uses animated indicator with stream-specific colors.
 *
 * @module components/layout/StreamSwitcher
 */
import { motion } from 'framer-motion';
import { useApp, STREAMS } from '../../contexts/AppContext';
import './StreamSwitcher.css';

const STREAM_OPTIONS = [
  { key: STREAMS.PULSE, label: 'Pulse', emoji: '💓', className: 'stream-pulse' },
  { key: STREAMS.VISION, label: 'Vision', emoji: '✨', className: 'stream-vision' },
  { key: STREAMS.CORE, label: 'Core', emoji: '🔬', className: 'stream-core' },
];

/**
 * StreamSwitcher renders a segmented control for the Triple-Stream Architecture.
 * @returns {JSX.Element}
 */
export default function StreamSwitcher() {
  const { activeStream, setStream } = useApp();

  return (
    <nav className="stream-switcher" role="tablist" aria-label="Learning stream">
      {STREAM_OPTIONS.map((option) => {
        const isActive = activeStream === option.key;
        return (
          <button
            key={option.key}
            role="tab"
            id={`stream-tab-${option.key}`}
            aria-selected={isActive}
            aria-controls={`stream-panel-${option.key}`}
            className={`stream-switcher__tab ${option.className} ${isActive ? 'active' : ''}`}
            onClick={() => setStream(option.key)}
          >
            {isActive && (
              <motion.span
                className="stream-switcher__indicator"
                layoutId="stream-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="stream-switcher__emoji">{option.emoji}</span>
            <span className="stream-switcher__label">{option.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
