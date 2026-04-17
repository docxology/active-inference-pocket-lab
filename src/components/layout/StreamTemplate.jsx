/**
 * @file StreamTemplate.jsx — Shared stream layout
 * @description A reusable presentation shell every Pulse/Vision/Core stream can
 * adopt. Keeps typography, progress dots, and completion logic consistent
 * across Modules 2-10 while letting each stream inject custom interactives.
 *
 * Each "beat" is a JSX node. When the learner clicks the final continue button
 * the `onComplete` callback fires — the stream implementation decides what that
 * means (progress, reward, etc).
 *
 * @module components/layout/StreamTemplate
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticLight, hapticMedium, hapticSuccess } from '../../utils/haptics';
import './StreamTemplate.css';

/**
 * @typedef {Object} StreamBeat
 * @property {string} id
 * @property {React.ReactNode} content - the prose shown at the top of the beat.
 * @property {React.ReactNode} [interactive] - the widget shown beneath.
 */

/**
 * StreamTemplate — step-through narrative with optional interactives.
 *
 * @param {Object} props
 * @param {string} props.streamKey - 'pulse' | 'vision' | 'core'
 * @param {StreamBeat[]} props.beats
 * @param {(frac:number)=>void} [props.onProgress] - called with 0..1 per step
 * @param {()=>void} [props.onComplete]
 * @param {string} [props.finalLabel='Continue']
 */
export default function StreamTemplate({
  streamKey = 'pulse',
  beats,
  onProgress,
  onComplete,
  finalLabel = 'Spin 🌀',
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const advance = useCallback(() => {
    const isLast = index === beats.length - 1;
    if (isLast) {
      setDone(true);
      hapticSuccess();
      onProgress?.(1);
      onComplete?.();
      return;
    }
    hapticMedium();
    const next = index + 1;
    setIndex(next);
    onProgress?.(next / (beats.length - 1));
  }, [index, beats.length, onProgress, onComplete]);

  const go = useCallback(
    (i) => {
      if (i === index) return;
      hapticLight();
      setIndex(i);
    },
    [index],
  );

  const beat = beats[index];

  return (
    <div className={`stream-t stream-t--${streamKey}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={beat.id}
          className="stream-t__beat"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        >
          <div className="stream-t__content">{beat.content}</div>
          {beat.interactive && <div className="stream-t__interactive">{beat.interactive}</div>}
        </motion.div>
      </AnimatePresence>

      <footer className="stream-t__footer">
        <div className="stream-t__dots" role="tablist" aria-label="Stream progress">
          {beats.map((b, i) => (
            <button
              key={b.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Beat ${i + 1}`}
              className={`stream-t__dot ${i <= index ? 'active' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button className="stream-t__continue" onClick={advance} disabled={done}>
          {index === beats.length - 1 ? finalLabel : 'Continue →'}
        </button>
      </footer>
    </div>
  );
}
