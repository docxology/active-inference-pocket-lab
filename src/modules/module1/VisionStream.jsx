/**
 * @file VisionStream.jsx — Module 1 Vision Experience
 * @description "The Artist" stream for Module 1: The First Orbit.
 *
 * Interactive canvas with orbiting particles whose behavior changes
 * based on slider values (the "Variable Hearth").
 *
 * Focus: generative art + real-time response to active inference parameters.
 * Completion triggers the "Spin" reward animation.
 *
 * @module modules/module1/VisionStream
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import RewardAnimation from '../../components/interactive/RewardAnimation';
import { useApp } from '../../contexts/AppContext';
import './VisionStream.css';

/**
 * Draw orbiting particles on a canvas.
 * Particles orbit with radius and speed affected by the prior belief parameter.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} time - Animation time (ms)
 * @param {number} prior - Prior belief value (0-100)
 * @param {number} precision - Precision value (0-100)
 */
function drawOrbits(ctx, width, height, time, prior, precision) {
  const cx = width / 2;
  const cy = height / 2;
  const numParticles = 24;
  const t = time * 0.001;

  // Clear with fade trail
  ctx.fillStyle = 'rgba(13, 15, 20, 0.15)';
  ctx.fillRect(0, 0, width, height);

  // Central glow
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
  gradient.addColorStop(0, `rgba(255, 107, 107, ${0.3 + prior * 0.005})`);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(cx - 50, cy - 50, 100, 100);

  // Draw particles
  for (let i = 0; i < numParticles; i++) {
    const angle = (i / numParticles) * Math.PI * 2 + t * (0.5 + (prior / 100) * 2);
    const baseRadius = 50 + (prior / 100) * 80;
    const wobble = Math.sin(t * 3 + i) * (100 - precision) * 0.3;
    const radius = baseRadius + wobble;

    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    // Particle color shifts with prior
    const hue = (i / numParticles) * 360 + prior * 2;
    const size = 3 + (precision / 100) * 4;
    const alpha = 0.6 + (precision / 100) * 0.4;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 80%, 65%, ${alpha})`;
    ctx.fill();

    // Glow
    ctx.beginPath();
    ctx.arc(x, y, size * 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 80%, 65%, ${alpha * 0.15})`;
    ctx.fill();
  }

  // Connection lines (low precision = more chaotic)
  ctx.strokeStyle = `rgba(124, 107, 255, ${precision * 0.003})`;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < numParticles; i++) {
    const angle1 = (i / numParticles) * Math.PI * 2 + t * (0.5 + (prior / 100) * 2);
    const r1 = 50 + (prior / 100) * 80 + Math.sin(t * 3 + i) * (100 - precision) * 0.3;
    const x1 = cx + Math.cos(angle1) * r1;
    const y1 = cy + Math.sin(angle1) * r1;

    const j = (i + 1) % numParticles;
    const angle2 = (j / numParticles) * Math.PI * 2 + t * (0.5 + (prior / 100) * 2);
    const r2 = 50 + (prior / 100) * 80 + Math.sin(t * 3 + j) * (100 - precision) * 0.3;
    const x2 = cx + Math.cos(angle2) * r2;
    const y2 = cy + Math.sin(angle2) * r2;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

/**
 * VisionStream — Module 1 generative art experience.
 * @returns {JSX.Element}
 */
export default function VisionStream() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [prior, setPrior] = useState(50);
  const [precision, setPrecision] = useState(50);
  const [hasExplored, setHasExplored] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const { updateProgress } = useApp();

  const handlePriorChange = useCallback(
    (value) => {
      setPrior(value);
      setInteractionCount((c) => {
        const next = c + 1;
        if (next >= 10 && !hasExplored) {
          setHasExplored(true);
          setShowReward(true);
          updateProgress(1, 'vision', 100);
          console.log('[VisionStream] Exploration threshold reached — reward!');
        }
        return next;
      });
    },
    [hasExplored, updateProgress],
  );

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = (time) => {
      const rect = canvas.getBoundingClientRect();
      drawOrbits(ctx, rect.width, rect.height, time, prior, precision);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [prior, precision]);

  return (
    <div className="vision-stream stream-vision" role="tabpanel" id="stream-panel-vision">
      {/* Canvas */}
      <div className="vision-stream__canvas-container">
        <canvas
          ref={canvasRef}
          className="vision-stream__canvas"
          aria-label="Generative orbit visualization responding to your parameters"
        />
        <div className="vision-stream__canvas-label">
          <span>The Variable Hearth</span>
        </div>
      </div>

      {/* Controls — The Variable Hearth */}
      <div className="vision-stream__controls">
        <InferenceSlider
          min={0}
          max={100}
          value={prior}
          onChange={handlePriorChange}
          label="Prior Strength"
          leftLabel="Weak"
          rightLabel="Strong"
          color="var(--color-vision)"
        />

        <InferenceSlider
          min={0}
          max={100}
          value={precision}
          onChange={setPrecision}
          label="Precision"
          leftLabel="Uncertain"
          rightLabel="Precise"
          color="var(--color-core)"
        />

        <p className="vision-stream__moves text-label" aria-live="polite">
          Exploration moves: {interactionCount}
          {!hasExplored ? ' — keep playing past 10 moves to complete this stream' : ' — orbit unlocked'}
        </p>
      </div>

      {/* Exploration hint */}
      {!hasExplored && (
        <motion.p
          className="vision-stream__hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ✨ Explore the sliders to see how beliefs shape the orbit pattern
        </motion.p>
      )}

      {/* Reward */}
      <RewardAnimation
        active={showReward}
        onComplete={() => setShowReward(false)}
        message="Spin!"
      />
    </div>
  );
}
