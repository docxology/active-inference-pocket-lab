/**
 * @file module3/VisionStream.jsx — The High Road, vision experience
 * @description Navigate a 2-D free-energy landscape. Drag the attractor; watch
 * the ball find the basin.
 */
import { useState } from 'react';
import StreamTemplate from '../../components/layout/StreamTemplate';
import FreeEnergyField from '../../components/interactive/FreeEnergyField';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function VisionStream() {
  const [ax, setAx] = useState(0.5);
  const [ay, setAy] = useState(0.5);
  const [noise, setNoise] = useState(0);
  const [spread, setSpread] = useState(0.25);
  const { onProgress, onComplete } = useStreamProgress(3, 'vision', 5);

  const Controls = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
      <InferenceSlider min={0.05} max={0.95} step={0.01} value={ax} onChange={setAx} label="Attractor x" color="var(--color-vision)" />
      <InferenceSlider min={0.05} max={0.95} step={0.01} value={ay} onChange={setAy} label="Attractor y" color="var(--color-vision)" />
      <InferenceSlider min={0.05} max={0.5} step={0.01} value={spread} onChange={setSpread} label="Well width σ" color="var(--color-core)" />
      <InferenceSlider min={0} max={0.15} step={0.005} value={noise} onChange={setNoise} label="Noise (temperature)" color="var(--color-pulse)" />
    </div>
  );

  const beats = [
    {
      id: 'tour',
      content: (
        <>
          <h2>Every dot is a belief.</h2>
          <p>
            The ball is always at the configuration you currently hold. Warm colours = high free
            energy. Cool colours = low. The ball wants to fall.
          </p>
        </>
      ),
      interactive: <FreeEnergyField attractorX={ax} attractorY={ay} spread={spread} noise={noise} />,
    },
    {
      id: 'attractor',
      content: (
        <>
          <h2>Move the attractor.</h2>
          <p>Slide the white dot around. The landscape re-shapes, and the ball re-plans.</p>
        </>
      ),
      interactive: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <FreeEnergyField attractorX={ax} attractorY={ay} spread={spread} noise={noise} />
          {Controls}
        </div>
      ),
    },
    {
      id: 'stochastic',
      content: (
        <>
          <h2>Add a little noise.</h2>
          <p>
            Turn temperature up: descent becomes stochastic, the ball explores. This is the bridge
            between inference and sampling.
          </p>
        </>
      ),
      interactive: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <FreeEnergyField attractorX={ax} attractorY={ay} spread={spread} noise={noise} />
          {Controls}
        </div>
      ),
    },
  ];

  return <StreamTemplate streamKey="vision" beats={beats} onProgress={onProgress} onComplete={onComplete} />;
}
