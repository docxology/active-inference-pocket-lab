/**
 * @file module7/VisionStream.jsx — Discrete Worlds (vision)
 */
import { useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import GridWorld from '../../components/interactive/GridWorld';
import { useStreamProgress } from '../shared/useStreamProgress';

function TunedGrid() {
  const [risk, setRisk] = useState(1);
  const [ambiguity, setAmbiguity] = useState(1);
  return (
    <div className="tuned-grid">
      <GridWorld risk={risk} ambiguity={ambiguity} />
      <div className="tuned-grid__controls">
        <label>
          Risk weight <span>{risk.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={risk}
            onChange={(e) => setRisk(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Ambiguity weight <span>{ambiguity.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={ambiguity}
            onChange={(e) => setAmbiguity(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <style>{`
        .tuned-grid { display: flex; flex-direction: column; gap: var(--space-md); }
        .tuned-grid__controls { display: grid; gap: var(--space-sm); }
        .tuned-grid__controls label { display: grid; gap: 4px; font-size: var(--font-size-sm); color: var(--color-text-secondary); }
        .tuned-grid__controls span { color: var(--color-accent); font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}

export default function VisionStream() {
  const { onProgress, onComplete } = useStreamProgress(7, 'vision', 7);
  const beats = [
    {
      id: 'tune',
      content: (
        <>
          <h2>Dial the agent's personality.</h2>
          <p>
            Push <em>risk</em> up and the agent bolts for the goal. Push <em>ambiguity</em> up and
            it wanders, mapping every corner. Same math, different soul.
          </p>
        </>
      ),
      interactive: <TunedGrid />,
    },
    {
      id: 'policy',
      content: (
        <>
          <h2>Policies are plans, weighted by EFE.</h2>
          <p>
            Each candidate plan gets a score. Softmax turns scores into probabilities. The agent
            picks — then replans next tick. Planning is breathing.
          </p>
        </>
      ),
      interactive: <GridWorld risk={0.6} ambiguity={1.2} />,
    },
    {
      id: 'lesson',
      content: (
        <>
          <h2>Grids are toy universes.</h2>
          <p>
            Every real-world planner — drones, traders, LLM agents — can be cast in this language.
            Discrete, finite, honest. You just made one.
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
