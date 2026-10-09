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
import ModuleRetrievalQuiz from '../shared/ModuleRetrievalQuiz';
import { useSettings } from '../../contexts/SettingsContext';
import { gaussianProduct, gaussianKL, gaussianSurprise } from '../../utils/activeInference';
import { useStreamProgress } from '../shared/useStreamProgress';
import './CoreStream.css';

/**
 * Calculate surprise and free energy for given parameters.
 * @param {number} observation - Observed value
 * @param {number} prior - Prior mean
 * @param {number} precision - Precision (inverse variance)
 * @returns {{ surprise: number, freeEnergy: number, kl: number }}
 */
function computeMetrics(observation, prior, precision, approximateMean) {
  // s ~ N(prior, 100); o|s ~ N(s, 50/precision). q has the posterior variance.
  const likelihoodPrecision = precision / 50;
  const posterior = gaussianProduct(prior, 0.01, observation, likelihoodPrecision);
  const surprise = gaussianSurprise(observation, prior, 1 / (100 + 1 / likelihoodPrecision));
  const kl = gaussianKL(approximateMean, posterior.pi, posterior.mu, posterior.pi);
  const freeEnergy = surprise + kl;

  return {
    surprise: surprise.toFixed(2),
    freeEnergy: freeEnergy.toFixed(2),
    kl: kl.toFixed(2),
    posteriorMean: posterior.mu.toFixed(2),
  };
}

/** Free Energy derivation steps */
const FE_DERIVATION_STEPS = [
  {
    latex: '\\mathcal{S} = -\\ln p(o \\mid m)',
    note: 'Start with the log-evidence (surprise).',
  },
  {
    latex: '\\mathcal{S} = -\\ln \\int p(o, s \\mid m) \\, ds',
    note: 'Marginalize over hidden states s.',
  },
  {
    latex: '\\mathcal{S} = -\\ln \\int \\frac{q(s)}{q(s)} p(o, s \\mid m) \\, ds',
    note: 'Introduce an approximate posterior q(s).',
  },
  {
    latex: '\\mathcal{S} \\leq F = \\mathbb{E}_q[-\\ln p(o, s \\mid m)] + \\mathbb{E}_q[\\ln q(s)]',
    note: "Apply Jensen's inequality to get the variational free energy bound.",
  },
  {
    latex:
      'F = \\underbrace{D_{\\text{KL}}[q(s) \\| p(s \\mid o, m)]}_{\\text{Posterior gap}} + \\underbrace{(-\\ln p(o \\mid m))}_{\\text{Surprise}}',
    note: 'Free Energy = KL divergence + Surprise. Minimizing F means making q close to the true posterior.',
  },
];

/**
 * CoreStream — Module 1 academic math experience.
 * @returns {JSX.Element}
 */
export default function CoreStream() {
  const { showMathByDefault } = useSettings();
  const [drawerOpen, setDrawerOpen] = useState(showMathByDefault);
  const [observation, setObservation] = useState(65);
  const [prior, setPrior] = useState(50);
  const [precision, setPrecision] = useState(50);
  const [approximateMean, setApproximateMean] = useState(50);
  const { moduleProgress } = useApp();
  const { onComplete } = useStreamProgress(1, 'core');
  const [hasExplored, setHasExplored] = useState(() => moduleProgress[1]?.core === 100);

  const metrics = useMemo(
    () => computeMetrics(observation, prior, precision, approximateMean),
    [observation, prior, precision, approximateMean],
  );

  const handleInteraction = useCallback(() => {
    if (!hasExplored) {
      setHasExplored(true);
      onComplete();
      console.log('[CoreStream] User explored the sandbox');
    }
  }, [hasExplored, onComplete]);

  return (
    <div
      className="core-stream stream-core"
      role="tabpanel"
      aria-labelledby="stream-tab-core"
      id="stream-panel-core"
    >
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
        latex="F = \underbrace{D_{\text{KL}}[q(s) \| p(s \mid o)]}_{\geq 0} + \underbrace{(-\ln p(o))}_{\text{Surprise}}"
        label="Eq. 1 — Variational Free Energy"
        description="Free energy bounds surprise from above. Minimizing F means either updating beliefs (perception) or changing the world (action)."
        steps={FE_DERIVATION_STEPS}
      />

      {/* Sandbox Toggle */}
      <motion.button
        className="core-stream__sandbox-toggle"
        onClick={() => {
          setDrawerOpen(true);
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span>🧪</span> Open the Sandbox
      </motion.button>

      {/* Sandbox Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Free Energy Sandbox">
        <div className="core-stream__sandbox">
          <p>
            Gaussian model: prior variance 100; likelihood variance 50 / precision. Exact posterior
            mean: {metrics.posteriorMean}. Move q toward it to close the KL gap.
          </p>
          <InferenceSlider
            min={0}
            max={100}
            step={0.01}
            value={approximateMean}
            onChange={(value) => {
              setApproximateMean(value);
              handleInteraction();
            }}
            label="Approximate posterior mean q"
            color="var(--color-core)"
          />
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
            latex={`F = D_{KL} + \\mathcal{S} \\approx ${metrics.freeEnergy}`}
            label="Live Computation"
            description="Adjust the sliders above to see how each parameter affects the free energy."
          />
        </div>
      </Drawer>

      {/* Supporting equations */}
      <MathBlock
        latex="\text{Surprise} = -\ln p(o)"
        label="Eq. 2 — Surprisal"
        description="Surprisal is negative log probability (or density for continuous observations). Continuous densities can exceed one, so their surprisal can be negative."
      />

      <MathBlock
        latex="p(o \mid m) = \int p(o \mid s) \, p(s \mid m) \, ds"
        label="Eq. 3 — Marginal Likelihood"
        description="The probability of an observation given the model — computed by integrating over all possible hidden states."
      />

      <section className="core-stream__retrieval" aria-labelledby="core-retrieval-heading">
        <h2 id="core-retrieval-heading">Check understanding</h2>
        <p className="core-stream__retrieval-lead">
          Three quick questions — no timer, clarity only.
        </p>
        <ModuleRetrievalQuiz moduleId={1} />
      </section>
    </div>
  );
}
