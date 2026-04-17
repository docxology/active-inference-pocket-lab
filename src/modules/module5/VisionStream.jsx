/**
 * @file module5/VisionStream.jsx — Message Passing (vision)
 */
import { useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import MessagePassingCircuit from '../../components/interactive/MessagePassingCircuit';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';
import GlossaryChips from '../../components/interactive/GlossaryChips';
import { getModuleById } from '../../data/modules';

export default function VisionStream() {
  const [precision, setPrecision] = useState(1);
  const [drive, setDrive] = useState(1);
  const { onProgress, onComplete } = useStreamProgress(5, 'vision', 6);
  const glossaryKeys = getModuleById(5).glossary;

  const Controls = (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <InferenceSlider
        min={0}
        max={2}
        step={0.05}
        value={precision}
        onChange={setPrecision}
        label="Prediction-error precision π"
        color="var(--color-pulse)"
      />
      <InferenceSlider
        min={0}
        max={2}
        step={0.05}
        value={drive}
        onChange={setDrive}
        label="Top-down drive"
        color="var(--color-vision)"
      />
    </div>
  );

  const beats = [
    {
      id: 'see',
      content: (
        <>
          <h2>Watch the cortex think.</h2>
          <p>Blue = top-down predictions. Red = bottom-up prediction errors.</p>
          <GlossaryTermsLine moduleId={5} />
        </>
      ),
      interactive: <MessagePassingCircuit precision={precision} drive={drive} />,
    },
    {
      id: 'tune',
      content: (
        <>
          <h2>Tune the gains.</h2>
          <p>This is a 2-knob model of attention and imagination.</p>
        </>
      ),
      interactive: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <MessagePassingCircuit precision={precision} drive={drive} />
          {Controls}
        </div>
      ),
    },
    {
      id: 'implication',
      content: (
        <>
          <h2>Hallucination, illusion, and clarity.</h2>
          <p>
            Too much drive, not enough precision → hallucination. The balance <em>is</em>
            perception.
          </p>
          <GlossaryChips keys={glossaryKeys} caption="Terms to revisit" />
        </>
      ),
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
