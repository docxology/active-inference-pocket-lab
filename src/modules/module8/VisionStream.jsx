/**
 * @file module8/VisionStream.jsx — Continuous Flow (vision)
 */
import { useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import FreeEnergyField from '../../components/interactive/FreeEnergyField';
import MessagePassingCircuit from '../../components/interactive/MessagePassingCircuit';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import GlossaryChips from '../../components/interactive/GlossaryChips';
import { getModuleById } from '../../data/modules';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';
import './VisionStream.css';

function FlowField() {
  const [spread, setSpread] = useState(1.2);
  const [noise, setNoise] = useState(0.1);
  return (
    <div className="flow-field">
      <FreeEnergyField spread={spread} noise={noise} />
      <div className="flow-field__controls">
        <InferenceSlider
          min={0.4}
          max={2.5}
          step={0.05}
          value={spread}
          onChange={setSpread}
          label="Landscape spread"
          color="var(--color-pulse)"
          formatValue={(v) => v.toFixed(2)}
        />
        <InferenceSlider
          min={0}
          max={0.5}
          step={0.01}
          value={noise}
          onChange={setNoise}
          label="Sensory noise"
          color="var(--color-vision)"
          formatValue={(v) => v.toFixed(2)}
        />
      </div>
    </div>
  );
}

export default function VisionStream() {
  const { onProgress, onComplete } = useStreamProgress(8, 'vision', 7);
  const glossaryKeys = getModuleById(8).glossary;
  const beats = [
    {
      id: 'landscape',
      content: (
        <>
          <h2>A landscape you can warp.</h2>
          <p>
            Widen the valleys: beliefs slip easily. Add noise: the particle jitters. The agent is
            always trying to reach the well — and the world is always pushing it around.
          </p>
          <GlossaryTermsLine moduleId={8} />
        </>
      ),
      interactive: <FlowField />,
    },
    {
      id: 'predictive',
      content: (
        <>
          <h2>Predictive coding in motion.</h2>
          <p>
            Drive the circuit — it's the same hierarchy, now running continuously. Predictions flow
            down, errors climb up, precisions gate the traffic.
          </p>
        </>
      ),
      interactive: <MessagePassingCircuit precision={1.1} drive={0.7} />,
    },
    {
      id: 'unity',
      content: (
        <>
          <h2>Continuous ≈ smooth discrete.</h2>
          <p>
            Take the time-step to zero and the grid-world's update rules become differential
            equations.
          </p>
        </>
      ),
      interactive: <GlossaryChips keys={glossaryKeys.slice(0, 4)} />,
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
