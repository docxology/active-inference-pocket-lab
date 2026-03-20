/**
 * @file RewardAnimation.jsx — Orbital Reward Burst
 * @description The "Spin" animation — orbiting particles that burst on completion.
 * Used as emotional rewards for consistency rather than competition.
 * 
 * @module components/interactive/RewardAnimation
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RewardAnimation.css';

/**
 * Generate particle positions for the burst animation.
 * @param {number} count - Number of particles
 * @returns {Array<{angle: number, distance: number, size: number, delay: number}>}
 */
function generateParticles(count = 12) {
  return Array.from({ length: count }, (_, i) => ({
    angle: (360 / count) * i + Math.random() * 20 - 10,
    distance: 60 + Math.random() * 40,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 0.15,
    hue: (360 / count) * i,
  }));
}

/**
 * RewardAnimation — Orbiting particle burst for completions.
 * 
 * @param {Object} props
 * @param {boolean} props.active - Whether to show the animation
 * @param {Function} [props.onComplete] - Callback when animation finishes
 * @param {string} [props.message] - Congratulatory message
 * @returns {JSX.Element}
 */
export default function RewardAnimation({ active, onComplete, message = 'Spin!' }) {
  const [particles] = useState(() => generateParticles());

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="reward-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Central glow */}
          <motion.div
            className="reward-animation__center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="reward-animation__message">{message}</span>
          </motion.div>

          {/* Particles */}
          {particles.map((p, i) => {
            const radians = (p.angle * Math.PI) / 180;
            const x = Math.cos(radians) * p.distance;
            const y = Math.sin(radians) * p.distance;

            return (
              <motion.span
                key={i}
                className="reward-animation__particle"
                style={{
                  width: p.size,
                  height: p.size,
                  background: `hsl(${p.hue}, 80%, 65%)`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x,
                  y,
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          {/* Orbiting ring */}
          <motion.div
            className="reward-animation__ring"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
