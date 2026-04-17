/**
 * @file DataFitter.jsx — Gaussian model fitting sandbox
 * @description Interactive scatter plot plus a tunable Gaussian curve. Reports
 * log evidence (accuracy − complexity) live. Used by Module 9 (Model-Based
 * Data Analysis).
 *
 * @module components/interactive/DataFitter
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { gaussianLogPdf } from '../../utils/activeInference';
import './DataFitter.css';

/**
 * Sample toy data from a ground-truth Gaussian.
 */
function sampleData(n = 30, mu = 5, sigma = 1.8) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    let u = 0;
    // Box–Muller for a Gaussian sample
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    pts.push(mu + z * sigma);
  }
  return pts;
}

/**
 * DataFitter — Fit a Gaussian model to sampled data, reporting log evidence.
 */
export default function DataFitter() {
  const canvasRef = useRef(null);
  const [mu, setMu] = useState(3);
  const [sigma, setSigma] = useState(1);
  const [data] = useState(() => sampleData(40, 5, 1.8));

  const { accuracy, complexity, logEvidence } = useMemo(() => {
    const pi = 1 / sigma ** 2;
    const acc = data.reduce((s, o) => s + gaussianLogPdf(o, mu, pi), 0) / data.length;
    // Complexity proxy: KL(q || flat-broad-prior) ≈ 0.5*((mu-m0)^2 / s0 + ln(s0/sigma))
    const mu0 = 0;
    const sig0 = 6;
    const comp = 0.5 * ((mu - mu0) ** 2 / sig0 ** 2 + Math.log((sig0 / sigma) ** 2));
    return { accuracy: acc, complexity: comp, logEvidence: acc - comp };
  }, [mu, sigma, data]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 320;
    const H = 180;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const xMin = -2;
    const xMax = 12;
    const scaleX = (x) => ((x - xMin) / (xMax - xMin)) * W;
    const scaleY = (y, m) => H - (y / m) * (H - 16);

    // Histogram bars
    const bins = 24;
    const counts = new Array(bins).fill(0);
    data.forEach((d) => {
      const b = Math.floor(((d - xMin) / (xMax - xMin)) * bins);
      if (b >= 0 && b < bins) counts[b]++;
    });
    const maxC = Math.max(...counts, 1);
    ctx.fillStyle = 'rgba(124, 107, 255, 0.35)';
    for (let b = 0; b < bins; b++) {
      const x = scaleX(xMin + ((b) / bins) * (xMax - xMin));
      const bw = (W / bins) * 0.92;
      const h = (counts[b] / maxC) * (H - 20);
      ctx.fillRect(x, H - h - 1, bw, h);
    }

    // Model curve
    const pi = 1 / sigma ** 2;
    const ys = [];
    let peak = 0;
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = Math.exp(gaussianLogPdf(x, mu, pi));
      if (y > peak) peak = y;
      ys.push({ x, y });
    }
    ctx.strokeStyle = '#ffb86b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ys.forEach((pt, i) => {
      const px = scaleX(pt.x);
      const py = scaleY(pt.y, peak);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(0, H - 1);
    ctx.lineTo(W, H - 1);
    ctx.stroke();
  }, [mu, sigma, data]);

  return (
    <div className="data-fitter">
      <canvas ref={canvasRef} className="data-fitter__canvas" style={{ width: 320, height: 180 }} />
      <div className="data-fitter__sliders">
        <label className="data-fitter__slider">
          <span>
            μ = <strong>{mu.toFixed(2)}</strong>
          </span>
          <input
            type="range"
            min="-2"
            max="12"
            step="0.05"
            value={mu}
            onChange={(e) => setMu(Number(e.target.value))}
          />
        </label>
        <label className="data-fitter__slider">
          <span>
            σ = <strong>{sigma.toFixed(2)}</strong>
          </span>
          <input
            type="range"
            min="0.2"
            max="5"
            step="0.05"
            value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="data-fitter__metrics">
        <div>
          <span>accuracy</span>
          <strong>{accuracy.toFixed(2)}</strong>
        </div>
        <div>
          <span>complexity</span>
          <strong>{complexity.toFixed(2)}</strong>
        </div>
        <div>
          <span>log evidence</span>
          <strong style={{ color: 'var(--color-accent)' }}>{logEvidence.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}
