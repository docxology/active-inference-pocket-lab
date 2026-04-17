/**
 * @file module2/VisionStream.jsx — The Low Road, vision experience
 * @description Visual Bayes: three Gaussians (prior, likelihood, posterior)
 * that dance as the user drags the sliders.
 *
 * @module modules/module2/VisionStream
 */
import { useMemo, useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import BeliefChart from '../../components/interactive/BeliefChart';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import { gaussianProduct } from '../../utils/activeInference';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function VisionStream() {
  const [muP, setMuP] = useState(2);
  const [piP, setPiP] = useState(1);
  const [muL, setMuL] = useState(7);
  const [piL, setPiL] = useState(2);
  const { onProgress, onComplete } = useStreamProgress(2, 'vision', 5);

  const { mu: muPost, pi: piPost } = useMemo(
    () => gaussianProduct(muP, piP, muL, piL),
    [muP, piP, muL, piL],
  );

  const curves = useMemo(
    () => [
      {
        name: 'prior',
        mean: muP,
        sigma: Math.sqrt(1 / Math.max(piP, 1e-6)),
        color: 'rgba(124,107,255,1)',
      },
      {
        name: 'likelihood',
        mean: muL,
        sigma: Math.sqrt(1 / Math.max(piL, 1e-6)),
        color: 'rgba(255,184,107,1)',
        dashed: true,
      },
      {
        name: 'posterior',
        mean: muPost,
        sigma: Math.sqrt(1 / Math.max(piPost, 1e-6)),
        color: 'rgba(107,203,119,1)',
      },
    ],
    [muP, piP, muL, piL, muPost, piPost],
  );

  const Sliders = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
      <InferenceSlider
        min={-3}
        max={13}
        value={muP}
        onChange={setMuP}
        step={0.1}
        label="Prior μₚ"
        color="var(--color-vision)"
      />
      <InferenceSlider
        min={0.1}
        max={5}
        value={piP}
        onChange={setPiP}
        step={0.1}
        label="Prior πₚ"
        color="var(--color-vision)"
      />
      <InferenceSlider
        min={-3}
        max={13}
        value={muL}
        onChange={setMuL}
        step={0.1}
        label="Likelihood μ_o"
        color="var(--color-accent)"
      />
      <InferenceSlider
        min={0.1}
        max={5}
        value={piL}
        onChange={setPiL}
        step={0.1}
        label="Likelihood π_o"
        color="var(--color-accent)"
      />
    </div>
  );

  const beats = [
    {
      id: 'setup',
      content: (
        <>
          <h2>Two voices, one posterior.</h2>
          <p>
            The blue wave is your prior. The orange dashed wave is the likelihood of an incoming
            observation. Where they meet — in green — lives your updated belief.
          </p>
          <GlossaryTermsLine moduleId={2} />
        </>
      ),
      interactive: <BeliefChart curves={curves} />,
    },
    {
      id: 'precision',
      content: (
        <>
          <h2>Turn up precision.</h2>
          <p>
            Watch what happens when you narrow one of the two sources: the posterior slides toward
            the more confident voice. <em>Precision is pull</em>.
          </p>
        </>
      ),
      interactive: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <BeliefChart curves={curves} />
          {Sliders}
        </div>
      ),
    },
    {
      id: 'closure',
      content: (
        <>
          <h2>That green curve is you, post-update.</h2>
          <p>
            μ₍post₎ = {muPost.toFixed(2)}, π₍post₎ = {piPost.toFixed(2)}. The brain does this
            everywhere, all the time, at every level.
          </p>
        </>
      ),
      interactive: <BeliefChart curves={curves} />,
    },
  ];

  return (
    <StreamTemplate
      streamKey="vision"
      beats={beats}
      onProgress={onProgress}
      onComplete={onComplete}
    />
  );
}
