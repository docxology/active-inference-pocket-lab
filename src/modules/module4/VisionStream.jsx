/**
 * @file module4/VisionStream.jsx — Generative Architecture (vision)
 */
import { useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import GenerativeGraph from '../../components/interactive/GenerativeGraph';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function VisionStream() {
  const [precision, setPrecision] = useState(1);
  const { onProgress, onComplete } = useStreamProgress(4, 'vision', 5);

  const beats = [
    {
      id: 'see',
      content: (
        <>
          <h2>Three layers. Three timescales.</h2>
          <p>
            The top node (s³) is slow — it describes a situation. Middle (s²) names objects. Bottom
            (s¹) points at pixels. Arrows are likelihoods.
          </p>
          <GlossaryTermsLine moduleId={4} />
        </>
      ),
      interactive: <GenerativeGraph precision={precision} />,
    },
    {
      id: 'precision',
      content: (
        <>
          <h2>Precision re-weights edges.</h2>
          <p>
            Crank it up: top-down predictions dominate, the model gets opinionated. Crank it down:
            bottom-up evidence wins, perception opens to surprise.
          </p>
        </>
      ),
      interactive: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <GenerativeGraph precision={precision} />
          <InferenceSlider
            min={0.2}
            max={2}
            step={0.05}
            value={precision}
            onChange={setPrecision}
            label="Edge precision"
            color="var(--color-vision)"
          />
        </div>
      ),
    },
    {
      id: 'build',
      content: (
        <>
          <h2>Your turn soon.</h2>
          <p>
            In Module 6 you'll pick every ingredient: A, B, C, D. For now notice how the shape of
            this diagram <em>is</em> the shape of the thought.
          </p>
        </>
      ),
      interactive: <GenerativeGraph precision={precision} highlight="s1b" />,
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
