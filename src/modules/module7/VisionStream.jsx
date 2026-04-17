/**
 * @file module7/VisionStream.jsx — Discrete Worlds (vision)
 */
import { useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import GridWorld from '../../components/interactive/GridWorld';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import GlossaryChips from '../../components/interactive/GlossaryChips';
import { getModuleById } from '../../data/modules';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';
import './VisionStream.css';

function TunedGrid() {
  const [risk, setRisk] = useState(1);
  const [ambiguity, setAmbiguity] = useState(1);
  return (
    <div className="tuned-grid">
      <GridWorld risk={risk} ambiguity={ambiguity} />
      <div className="tuned-grid__controls">
        <InferenceSlider
          min={0}
          max={2}
          step={0.05}
          value={risk}
          onChange={setRisk}
          label="Risk weight"
          color="var(--color-pulse)"
          formatValue={(v) => v.toFixed(2)}
        />
        <InferenceSlider
          min={0}
          max={2}
          step={0.05}
          value={ambiguity}
          onChange={setAmbiguity}
          label="Ambiguity weight"
          color="var(--color-vision)"
          formatValue={(v) => v.toFixed(2)}
        />
      </div>
    </div>
  );
}

export default function VisionStream() {
  const { onProgress, onComplete } = useStreamProgress(7, 'vision', 7);
  const glossaryKeys = getModuleById(7).glossary;
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
          <GlossaryTermsLine moduleId={7} />
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
