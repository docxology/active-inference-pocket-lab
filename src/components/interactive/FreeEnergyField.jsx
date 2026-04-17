/**
 * @file FreeEnergyField.jsx — 2-D Free Energy landscape
 * @description Renders a 2-D scalar field as a heatmap with a bouncing ball
 * that gradient-descends toward the basin of attraction. Used by Module 3
 * (High Road) and Module 8 (Continuous Flow).
 *
 * @module components/interactive/FreeEnergyField
 */
import { useEffect, useRef, useState } from 'react';
import { makeFreeEnergyField, gradientStep, sampleField } from '../../utils/activeInference';
import './FreeEnergyField.css';

/**
 * Map a value in [min, max] to a HSL colour stop for the heatmap.
 */
function colorFor(v, min, max) {
  const t = Math.max(0, Math.min(1, (v - min) / Math.max(max - min, 1e-6)));
  const hue = 220 - 220 * t; // blue (low) → red (high)
  return `hsl(${hue}, 65%, ${30 + 30 * t}%)`;
}

/**
 * FreeEnergyField — animated heatmap + descending particle.
 *
 * @param {Object} props
 * @param {number} [props.attractorX=0.5]
 * @param {number} [props.attractorY=0.5]
 * @param {number} [props.noise=0] - stochastic descent amplitude
 * @param {number} [props.spread=0.25] - width of the well
 * @param {number} [props.size=360]
 * @param {boolean} [props.running=true]
 */
export default function FreeEnergyField({
  attractorX = 0.5,
  attractorY = 0.5,
  noise = 0,
  spread = 0.25,
  size = 320,
  running = true,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const [particle, setParticle] = useState({ x: 0.12, y: 0.12 });
  const [field, setField] = useState(() =>
    makeFreeEnergyField({ size: 40, muX: attractorX, muY: attractorY, spread }),
  );

  useEffect(() => {
    setField(makeFreeEnergyField({ size: 40, muX: attractorX, muY: attractorY, spread }));
    setParticle({ x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 });
  }, [attractorX, attractorY, spread]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cellSize = size / field.length;
    let min = Infinity;
    let max = -Infinity;
    for (let y = 0; y < field.length; y++) {
      for (let x = 0; x < field[0].length; x++) {
        const v = field[y][x];
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    // Draw heatmap cells
    for (let y = 0; y < field.length; y++) {
      for (let x = 0; x < field[0].length; x++) {
        ctx.fillStyle = colorFor(field[y][x], min, max);
        ctx.fillRect(x * cellSize, y * cellSize, cellSize + 0.5, cellSize + 0.5);
      }
    }

    // Draw contours (simple iso-lines every 0.25σ)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 0.5;
    for (let y = 0; y < field.length; y++) {
      for (let x = 0; x < field[0].length; x++) {
        if ((x + y) % 3 === 0) {
          ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // Draw attractor marker
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(attractorX * size, attractorY * size, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.stroke();

    // Draw particle
    ctx.fillStyle = '#ffb86b';
    ctx.beginPath();
    ctx.arc(particle.x * size, particle.y * size, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 184, 107, 0.4)';
    ctx.beginPath();
    ctx.arc(particle.x * size, particle.y * size, 14, 0, Math.PI * 2);
    ctx.stroke();
  }, [field, particle, attractorX, attractorY, size]);

  useEffect(() => {
    if (!running) return;
    function tick() {
      setParticle((p) => {
        const next = gradientStep(field, p.x, p.y, { step: 0.04, noise });
        return { x: next.x, y: next.y };
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [field, noise, running]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setParticle({ x, y });
  };

  const fAtParticle = sampleField(field, particle.x, particle.y);

  return (
    <div className="fe-field">
      <canvas
        ref={canvasRef}
        className="fe-field__canvas"
        style={{ width: size, height: size }}
        onClick={handleClick}
        role="img"
        aria-label="Interactive free energy landscape — click to reset the particle"
      />
      <div className="fe-field__caption">
        <span>F ≈ {fAtParticle.toFixed(2)}</span>
        <span className="fe-field__hint">
          click the field to re-seed · attractor pulled by sliders
        </span>
      </div>
    </div>
  );
}
