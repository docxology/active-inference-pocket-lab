/**
 * @file MessagePassingCircuit.jsx — Predictive-coding message passing
 * @description Animated three-layer circuit with top-down predictions (blue)
 * and bottom-up prediction errors (red). Used by Module 5 (Message Passing).
 *
 * @module components/interactive/MessagePassingCircuit
 */
import { useEffect, useRef } from 'react';
import './MessagePassingCircuit.css';

/**
 * MessagePassingCircuit — Canvas animation of hierarchical predictive coding.
 *
 * @param {Object} props
 * @param {number} [props.precision=1] - 0..2 scales prediction-error strength
 * @param {number} [props.drive=1] - 0..2 scales top-down prediction strength
 * @param {boolean} [props.running=true]
 * @param {number} [props.size=320]
 */
export default function MessagePassingCircuit({
  precision = 1,
  drive = 1,
  running = true,
  size = 320,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const L = 3;
    const levels = Array.from({ length: L }, (_, i) => ({
      y: 60 + i * 80,
      name: ['Higher', 'Middle', 'Sensory'][i],
    }));
    const nodesPerLevel = 4;

    let t = 0;
    function frame() {
      ctx.clearRect(0, 0, size, size);

      // Draw nodes
      levels.forEach((lv, li) => {
        for (let i = 0; i < nodesPerLevel; i++) {
          const x = 60 + i * ((size - 120) / (nodesPerLevel - 1));
          ctx.beginPath();
          ctx.arc(x, lv.y, 9, 0, Math.PI * 2);
          ctx.fillStyle = li === 0 ? '#7c6bff' : li === 1 ? '#ffb86b' : '#ff6b6b';
          ctx.globalAlpha = 0.25;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#ffffff33';
          ctx.stroke();
        }
        ctx.fillStyle = '#b9b6c5';
        ctx.font = '11px monospace';
        ctx.fillText(lv.name, 6, lv.y + 4);
      });

      // Draw pulses (top-down blue / bottom-up red).
      // Top-down waves
      for (let i = 0; i < nodesPerLevel; i++) {
        const x = 60 + i * ((size - 120) / (nodesPerLevel - 1));
        const phase = (t * 0.03 + i * 0.7) % 1;
        for (let L2 = 0; L2 < 2; L2++) {
          const y0 = levels[L2].y;
          const y1 = levels[L2 + 1].y;
          const y = y0 + (y1 - y0) * phase;
          ctx.beginPath();
          ctx.arc(x, y, 3 + drive * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 107, 255, ${0.7 * drive})`;
          ctx.fill();
        }
      }
      // Bottom-up errors
      for (let i = 0; i < nodesPerLevel; i++) {
        const x = 60 + i * ((size - 120) / (nodesPerLevel - 1));
        const phase = (1 - ((t * 0.025 + i * 0.3) % 1));
        for (let L2 = 0; L2 < 2; L2++) {
          const y0 = levels[L2].y;
          const y1 = levels[L2 + 1].y;
          const y = y0 + (y1 - y0) * phase;
          ctx.beginPath();
          ctx.arc(x + 6, y, 2 + precision * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 107, 107, ${0.7 * precision})`;
          ctx.fill();
        }
      }

      // Precision halo
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let li = 0; li < L - 1; li++) {
        for (let i = 0; i < nodesPerLevel; i++) {
          const x = 60 + i * ((size - 120) / (nodesPerLevel - 1));
          ctx.beginPath();
          ctx.moveTo(x, levels[li].y + 9);
          ctx.lineTo(x, levels[li + 1].y - 9);
          ctx.stroke();
        }
      }

      if (running) t += 1;
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafRef.current);
  }, [precision, drive, running, size]);

  return (
    <div className="mp-circuit">
      <canvas
        ref={canvasRef}
        className="mp-circuit__canvas"
        style={{ width: size, height: size }}
        role="img"
        aria-label="Predictive coding message passing between three cortical levels"
      />
      <div className="mp-circuit__legend">
        <span className="mp-circuit__legend-item">
          <span className="mp-circuit__dot down" /> top-down prediction
        </span>
        <span className="mp-circuit__legend-item">
          <span className="mp-circuit__dot up" /> bottom-up error
        </span>
      </div>
    </div>
  );
}
