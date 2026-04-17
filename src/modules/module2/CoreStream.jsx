/**
 * @file module2/CoreStream.jsx — The Low Road, core experience
 * @description Bayes' theorem and precision-weighted predictive coding with
 * live Gaussian arithmetic.
 *
 * @module modules/module2/CoreStream
 */
import { useMemo, useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import { gaussianProduct } from '../../utils/activeInference';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function CoreStream() {
  const [muP, setMuP] = useState(0);
  const [piP, setPiP] = useState(1);
  const [o, setO] = useState(6);
  const [piO, setPiO] = useState(2);
  const { onProgress, onComplete } = useStreamProgress(2, 'core', 6);

  const { mu: muPost, pi: piPost } = useMemo(
    () => gaussianProduct(muP, piP, o, piO),
    [muP, piP, o, piO],
  );

  const beats = [
    {
      id: 'bayes',
      content: (
        <>
          <h2>Bayes, cleanly.</h2>
          <p>Posterior is proportional to prior × likelihood — four ingredients, one ratio.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="p(s \\mid o) = \\frac{p(o \\mid s)\\, p(s)}{p(o)}"
          label="Eq. 1 — Bayes' Theorem"
        />
      ),
    },
    {
      id: 'gaussian',
      content: (
        <>
          <h2>Under Gaussians it collapses.</h2>
          <p>
            The posterior mean is a <em>precision-weighted average</em>. Adjust below and watch the
            arithmetic tick in real time.
          </p>
        </>
      ),
      interactive: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <MathBlock
            latex={`\\mu_{post} = \\frac{${piO.toFixed(1)} \\cdot ${o.toFixed(1)} + ${piP.toFixed(1)} \\cdot ${muP.toFixed(1)}}{${(piP + piO).toFixed(1)}} = ${muPost.toFixed(2)}`}
            label="Precision-weighted posterior"
          />
          <InferenceSlider
            min={-5}
            max={15}
            value={muP}
            step={0.1}
            onChange={setMuP}
            label="Prior mean μₚ"
            color="var(--color-vision)"
          />
          <InferenceSlider
            min={0.1}
            max={5}
            value={piP}
            step={0.1}
            onChange={setPiP}
            label="Prior precision πₚ"
            color="var(--color-vision)"
          />
          <InferenceSlider
            min={-5}
            max={15}
            value={o}
            step={0.1}
            onChange={setO}
            label="Observation o"
            color="var(--color-accent)"
          />
          <InferenceSlider
            min={0.1}
            max={5}
            value={piO}
            step={0.1}
            onChange={setPiO}
            label="Likelihood precision π_o"
            color="var(--color-accent)"
          />
        </div>
      ),
    },
    {
      id: 'predictive',
      content: (
        <>
          <h2>Predictive coding.</h2>
          <p>
            Cortical updates ride on <em>precision-weighted prediction errors</em>: each layer sends
            its surprise to the next, scaled by how much it should matter.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\varepsilon^{(\\ell)} = \\pi^{(\\ell)}\\,(o^{(\\ell)} - g(\\mu^{(\\ell+1)}))"
          label="Eq. 2 — Prediction error update"
        />
      ),
    },
  ];

  return (
    <StreamTemplate
      streamKey="core"
      beats={beats}
      onProgress={onProgress}
      onComplete={onComplete}
    />
  );
}
