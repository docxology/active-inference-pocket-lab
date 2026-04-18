/**
 * @file module8/PulseStream.jsx — Continuous Flow (pulse)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import FreeEnergyField from '../../components/interactive/FreeEnergyField';
import BeliefChart from '../../components/interactive/BeliefChart';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function PulseStream() {
  const { onProgress, onComplete } = useStreamProgress(8, 'pulse', 6);
  const beats = [
    {
      id: 'river',
      content: (
        <>
          <h2>Time stops being a staircase.</h2>
          <p>
            In continuous flow, the agent isn't stepping — it's <em>gliding</em>. Beliefs, actions,
            and errors all flow as smooth trajectories down a free-energy landscape.
          </p>
          <GlossaryTermsLine moduleId={8} />
        </>
      ),
      interactive: <FreeEnergyField spread={1.4} noise={0.12} />,
    },
    {
      id: 'coords',
      content: (
        <>
          <h2>
            You predict position <em>and</em> velocity <em>and</em> acceleration.
          </h2>
          <p>
            That's "generalized coordinates." Brains don't just guess where the ball is — they guess
            where it's going, and how fast it's accelerating.
          </p>
        </>
      ),
      interactive: (
        <BeliefChart
          curves={[
            { name: 'position x', mean: 5, sigma: 1.2, color: 'rgba(124,107,255,1)' },
            { name: "velocity x'", mean: 2, sigma: 0.8, color: 'rgba(255,184,107,1)', dashed: true },
            { name: "accel x''", mean: 0.5, sigma: 0.5, color: 'rgba(107,203,119,1)' },
          ]}
          xMin={-2}
          xMax={10}
        />
      ),
    },
    {
      id: 'action',
      content: (
        <>
          <h2>Action is gradient descent on prediction error.</h2>
          <p>
            You move your body so the world matches your prediction. Reaching is literally the brain
            rolling downhill in a free-energy valley.
          </p>
        </>
      ),
      interactive: <FreeEnergyField x={-1} y={1} spread={1} />,
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
