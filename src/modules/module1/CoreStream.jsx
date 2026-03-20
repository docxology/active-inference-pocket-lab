/**
 * @file CoreStream.jsx — Module 1 Core Experience
 * @description "The Academic" stream for Module 1: The First Orbit.
 *
 * Clean LaTeX equations, sandbox environments, derivation steps.
 * Hidden in a drawer by default — user opens when ready for math.
 * Focus: deriving Free Energy with immediate visual feedback.
 *
 * @module modules/module1/CoreStream
 */
import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathBlock from '../../components/interactive/MathBlock';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import Drawer from '../../components/layout/Drawer';
import { useApp } from '../../contexts/AppContext';
import './CoreStream.css';

/**
 * Calculate surprise and free energy for given parameters.
 * @param {number} observation - Observed value
 * @param {number} prior - Prior mean
 * @param {number} precision - Precision (inverse variance)
 * @returns {{ surprise: number, freeEnergy: number, kl: number }}
 */
function computeMetrics(observation, prior, precision) {
  // Gaussian model: surprise = -log p(o|m) ≈ (o - μ)² / (2σ²) + const
  const variance = 1 / (Math.max(precision, 0.01) / 50);
  const surprise =
    (observation - prior) ** 2 / (2 * variance) + 0.5 * Math.log(2 * Math.PI * variance);

  // Free energy ≥ surprise (equality when q = p)
  // F = E_q[-log p(o,s)] + H[q] = surprise + KL
  const kl = Math.max(0, Math.abs(observation - prior) * 0.02);
  const freeEnergy = surprise + kl;

  return {
    surprise: Math.max(0, surprise).toFixed(2),
    freeEnergy: Math.max(0, freeEnergy).toFixed(2),
    kl: kl.toFixed(3),
  };
}

/** Free Energy derivation steps */
const FE_DERIVATION_STEPS = [
  {
    latex: 'F = -\\ln p(o \\mid m)',
    note: 'Start with the log-evidence (surprise).',
  },
  {
    latex: 'F = -\\ln \\int p(o, s \\mid m) \\, ds',
    note: 'Marginalize over hidden states s.',
  },
  {
    latex: 'F = -\\ln \\int \\frac{q(s)}{q(s)} p(o, s \\mid m) \\, ds',
    note: 'Introduce an approximate posterior q(s).',
  },
  {
    latex:
      'F \\geq \\underbrace{\\mathbb{E}_q[-\\ln p(o, s \\mid m)]}_{\\text{Energy}} + \\underbrace{\\mathbb{E}_q[\\ln q(s)]}_{-\\text{Entropy}}',
    note: "Apply Jensen's inequality to get the variational free energy bound.",
  },
  {
    latex:
      'F = \\underbrace{D_{\\text{KL}}[q(s) \\| p(s \\mid o, m)]}_{\\text{Complexity}} + \\underbrace{(-\\ln p(o \\mid m))}_{\\text{Surprise}}',
    note: 'Free Energy = KL divergence + Surprise. Minimizing F means making q close to the true posterior.',
  },
];

/**
 * CoreStream — Module 1 academic math experience.
 * @returns {JSX.Element}
 */
export default function CoreStream() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [observation, setObservation] = useState(65);
  const [prior, setPrior] = useState(50);
  const [precision, setPrecision] = useState(50);
  const { updateProgress } = useApp();
  const [hasExplored, setHasExplored] = useState(false);

  const metrics = useMemo(
    () => computeMetrics(observation, prior, precision),
    [observation, prior, precision],
  );

  const handleInteraction = useCallback(() => {
    if (!hasExplored) {
      setHasExplored(true);
      updateProgress(1, 'core', 100);
      console.log('[CoreStream] User explored the sandbox');
    }
  }, [hasExplored, updateProgress]);

  return (
    <div className="core-stream stream-core" role="tabpanel" id="stream-panel-core">
      {/* Introduction */}
      <div className="core-stream__intro">
        <h2>The Mathematics of Surprise</h2>
        <p>
          Active Inference rests on a single principle: living systems minimize
          <strong> variational free energy</strong>. Explore the equations below, or open the
          sandbox to see the math respond to your inputs.
        </p>
      </div>

      {/* Main Equation */}
      <MathBlock
        latex="F = \\underbrace{D_{\\text{KL}}[q(s) \\| p(s \\mid o)]}_{\\geq 0} + \\underbrace{(-\\ln p(o))}_{\\text{Surprise}}"
        label="Eq. 1 — Variational Free Energy"
        description="Free energy bounds surprise from above. Minimizing F means either updating beliefs (perception) or changing the world (action)."
        steps={FE_DERIVATION_STEPS}
      />

      {/* Sandbox Toggle */}
      <motion.button
        className="core-stream__sandbox-toggle"
        onClick={() => {
          setDrawerOpen(true);
          handleInteraction();
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span>🧪</span> Open the Sandbox
      </motion.button>

      {/* Sandbox Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Free Energy Sandbox">
        <div className="core-stream__sandbox">
          {/* Sliders */}
          <InferenceSlider
            min={0}
            max={100}
            value={prior}
            onChange={(v) => {
              setPrior(v);
              handleInteraction();
            }}
            label="Prior Mean (μ)"
            color="var(--color-core)"
          />
          <InferenceSlider
            min={1}
            max={100}
            value={precision}
            onChange={(v) => {
              setPrecision(v);
              handleInteraction();
            }}
            label="Precision (π)"
            leftLabel="Low"
            rightLabel="High"
            color="var(--color-vision)"
          />
          <InferenceSlider
            min={0}
            max={100}
            value={observation}
            onChange={(v) => {
              setObservation(v);
              handleInteraction();
            }}
            label="Observation (o)"
            color="var(--color-pulse)"
          />

          {/* Live Metrics */}
          <div className="core-stream__metrics">
            <div className="core-stream__metric">
              <span className="core-stream__metric-label">Surprise</span>
              <span className="core-stream__metric-value" style={{ color: 'var(--color-pulse)' }}>
                {metrics.surprise}
              </span>
            </div>
            <div className="core-stream__metric">
              <span className="core-stream__metric-label">KL Divergence</span>
              <span className="core-stream__metric-value" style={{ color: 'var(--color-vision)' }}>
                {metrics.kl}
              </span>
            </div>
            <div className="core-stream__metric">
              <span className="core-stream__metric-label">Free Energy</span>
              <span className="core-stream__metric-value" style={{ color: 'var(--color-core)' }}>
                {metrics.freeEnergy}
              </span>
            </div>
          </div>

          {/* Live equation with substituted values */}
          <MathBlock
            latex={`F = ${metrics.kl} + ${metrics.surprise} = ${metrics.freeEnergy}`}
            label="Live Computation"
            description="Adjust the sliders above to see how each parameter affects the free energy."
          />
        </div>
      </Drawer>

      {/* Supporting equations */}
      <MathBlock
        latex="\\text{Surprise} = -\\ln p(o) \\geq 0"
        label="Eq. 2 — Surprisal"
        description="Surprise measures how unexpected an observation is under the model. A low-probability observation yields high surprise."
      />

      <MathBlock
        latex="p(o \\mid m) = \\int p(o \\mid s) \\, p(s \\mid m) \\, ds"
        label="Eq. 3 — Marginal Likelihood"
        description="The probability of an observation given the model — computed by integrating over all possible hidden states."
      />
    </div>
  );
}
