/**
 * @file module2/PulseStream.jsx — The Low Road, pulse experience
 * @description Feels Bayesian updating as prediction errors. Drag the prior,
 * watch the gap, update the belief.
 *
 * @module modules/module2/PulseStream
 */
import { useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function PulseStream() {
  const [prior, setPrior] = useState(4);
  const [observation] = useState(() => Math.round(Math.random() * 6 + 3));
  const diff = observation - prior;
  const absDiff = Math.abs(diff);
  const verdict =
    absDiff < 1
      ? '✓ Barely any surprise — your model already covered this.'
      : absDiff < 3
        ? '→ Some surprise — your model wants to lean toward the data.'
        : '! High surprise — this is where most learning happens.';
  const { onProgress, onComplete } = useStreamProgress(2, 'pulse', 5);

  const beats = [
    {
      id: 'mismatch',
      content: (
        <>
          <h2>Every glance is a small bet.</h2>
          <p>
            Before you opened your eyes today your brain had already wagered the <em>prior</em>:
            where your phone is, what the light looks like, how the bed feels.
          </p>
          <p>
            Prediction is cheap. Checking — that's the work. Pull the slider to post your prior for
            this screen, then I'll reveal what actually shows up.
          </p>
        </>
      ),
      interactive: (
        <InferenceSlider
          min={0}
          max={10}
          value={prior}
          onChange={setPrior}
          label="Your prior μₚ"
          leftLabel="cold"
          rightLabel="warm"
          color="var(--color-pulse)"
        />
      ),
    },
    {
      id: 'error',
      content: (
        <>
          <h2>Observation: {observation}.</h2>
          <p>
            The gap between your prior ({prior}) and the observation is the{' '}
            <em>prediction error</em>: {diff > 0 ? `+${diff}` : diff}.
          </p>
          <p className="pulse-hint" style={{ textAlign: 'center' }}>
            {verdict}
          </p>
        </>
      ),
    },
    {
      id: 'update',
      content: (
        <>
          <h2>Updating is the answer.</h2>
          <p>
            Bayes says: <em>weighted average</em>. The tighter the source (higher precision), the
            more pull it has.
          </p>
          <p>
            You're never reading the world plain. You're re-writing your model of it, one prediction
            error at a time.
          </p>
        </>
      ),
    },
  ];

  return (
    <StreamTemplate
      streamKey="pulse"
      beats={beats}
      onProgress={onProgress}
      onComplete={onComplete}
    />
  );
}
