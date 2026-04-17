/**
 * @file module8/VisionStream.jsx — Continuous Flow (vision)
 */
import { useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import FreeEnergyField from '../../components/interactive/FreeEnergyField';
import MessagePassingCircuit from '../../components/interactive/MessagePassingCircuit';
import { useStreamProgress } from '../shared/useStreamProgress';

function FlowField() {
  const [spread, setSpread] = useState(1.2);
  const [noise, setNoise] = useState(0.1);
  return (
    <div className="flow-field">
      <FreeEnergyField spread={spread} noise={noise} />
      <div className="flow-field__controls">
        <label>
          Landscape spread <span>{spread.toFixed(2)}</span>
          <input
            type="range"
            min={0.4}
            max={2.5}
            step={0.05}
            value={spread}
            onChange={(e) => setSpread(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Sensory noise <span>{noise.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={noise}
            onChange={(e) => setNoise(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <style>{`
        .flow-field { display: flex; flex-direction: column; gap: var(--space-md); }
        .flow-field__controls { display: grid; gap: var(--space-sm); }
        .flow-field__controls label { display: grid; gap: 4px; font-size: var(--font-size-sm); color: var(--color-text-secondary); }
        .flow-field__controls span { color: var(--color-accent); font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}

export default function VisionStream() {
  const { onProgress, onComplete } = useStreamProgress(8, 'vision', 7);
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
