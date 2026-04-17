/**
 * @file BeliefChart.jsx — 1-D Gaussian belief chart
 * @description Renders up to three Gaussian distributions (prior, likelihood,
 * posterior) as overlapping curves. Used by Module 2 (Low Road) and Module 9
 * (Model-Based Data Analysis) to make Bayesian updating visible.
 *
 * @module components/interactive/BeliefChart
 */
import { useEffect, useRef } from 'react';
import './BeliefChart.css';

const DEFAULTS = {
  width: 320,
  height: 160,
  xMin: -5,
  xMax: 15,
  samples: 120,
};

/**
 * Return evenly-spaced x values across a range.
 */
function linspace(a, b, n) {
  const out = new Array(n);
  const step = (b - a) / (n - 1);
  for (let i = 0; i < n; i++) out[i] = a + step * i;
  return out;
}

/**
 * Gaussian pdf, guarded against tiny precision.
 */
function gaussianPdf(x, mu, sigma) {
  const s = Math.max(sigma, 1e-3);
  return Math.exp(-0.5 * ((x - mu) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
}

/**
 * @typedef {Object} Curve
 * @property {string} name
 * @property {number} mean
 * @property {number} sigma
 * @property {string} color
 * @property {boolean} [dashed]
 */

/**
 * BeliefChart — stacked Gaussians with filled area under each curve.
 *
 * @param {Object} props
 * @param {Curve[]} props.curves
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {number} [props.xMin]
 * @param {number} [props.xMax]
 * @returns {JSX.Element}
 */
export default function BeliefChart({
  curves,
  width = DEFAULTS.width,
  height = DEFAULTS.height,
  xMin = DEFAULTS.xMin,
  xMax = DEFAULTS.xMax,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background grid
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const xs = linspace(xMin, xMax, DEFAULTS.samples);
    // Compute global max for y-scaling
    let globalMax = 0;
    const ys = curves.map((c) => {
      const arr = xs.map((x) => gaussianPdf(x, c.mean, c.sigma));
      const m = Math.max(...arr);
      if (m > globalMax) globalMax = m;
      return arr;
    });
    const scaleX = (x) => ((x - xMin) / (xMax - xMin)) * width;
    const scaleY = (y) => height - (y / Math.max(globalMax, 1e-6)) * (height - 10);

    // Draw axis baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(0, height - 1);
    ctx.lineTo(width, height - 1);
    ctx.stroke();

    // Draw each curve
    curves.forEach((c, i) => {
      const arr = ys[i];
      ctx.beginPath();
      ctx.moveTo(scaleX(xs[0]), scaleY(arr[0]));
      for (let k = 1; k < xs.length; k++) {
        ctx.lineTo(scaleX(xs[k]), scaleY(arr[k]));
      }
      if (c.dashed) ctx.setLineDash([5, 4]);
      else ctx.setLineDash([]);
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Fill area
      ctx.lineTo(scaleX(xs[xs.length - 1]), height);
      ctx.lineTo(scaleX(xs[0]), height);
      ctx.closePath();
      ctx.fillStyle = c.color
        .replace('1)', '0.15)')
        .replace('rgb(', 'rgba(')
        .replace(')', ',0.15)');
      // fallback fill:
      ctx.globalAlpha = 0.15;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Mean markers
    curves.forEach((c) => {
      const x = scaleX(c.mean);
      ctx.strokeStyle = c.color;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(x, 4);
      ctx.lineTo(x, height - 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }, [curves, width, height, xMin, xMax]);

  return (
    <div
      className="belief-chart"
      role="img"
      aria-label={`Belief chart with ${curves.length} Gaussian distributions`}
    >
      <canvas ref={canvasRef} style={{ width, height }} />
      <div className="belief-chart__legend">
        {curves.map((c, i) => (
          <div className="belief-chart__legend-item" key={`${c.name}-${i}`}>
            <span
              className="belief-chart__legend-dot"
              style={{ background: c.color, borderStyle: c.dashed ? 'dashed' : 'solid' }}
            />
            <span className="belief-chart__legend-label">
              {c.name}{' '}
              <span className="belief-chart__legend-values">
                μ={c.mean.toFixed(1)}, σ={c.sigma.toFixed(2)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
