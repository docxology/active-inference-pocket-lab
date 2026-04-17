/**
 * @file module8/CoreStream.jsx — Continuous Flow (core)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import FreeEnergyField from '../../components/interactive/FreeEnergyField';
import { useStreamProgress } from '../shared/useStreamProgress';
import { getCoreRetrievalBeat } from '../shared/getCoreRetrievalBeat';

export default function CoreStream() {
  const { onProgress, onComplete } = useStreamProgress(8, 'core', 8);
  const beats = [
    {
      id: 'gen-coords',
      content: (
        <>
          <h2>Generalized coordinates of motion.</h2>
          <p>
            Instead of a scalar state, carry its time-derivatives: position, velocity, acceleration,
            jerk… The brain represents <em>trajectories</em>, not points.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\tilde x = \\big(x,\\; x',\\; x'',\\; x''',\\; \\ldots\\big)^\\top"
          label="Generalized motion vector"
        />
      ),
    },
    {
      id: 'dynamics',
      content: (
        <>
          <h2>Belief dynamics.</h2>
          <p>
            Posterior modes flow downhill in free energy while also being carried by their own
            motion. Two terms: gradient + shift.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\dot{\\tilde\\mu} = \\mathcal{D}\\tilde\\mu - \\partial_{\\tilde\\mu} F(\\tilde\\mu,\\tilde y)"
          label="Generalized gradient descent"
        />
      ),
    },
    {
      id: 'action',
      content: (
        <>
          <h2>Active inference in motor terms.</h2>
          <p>
            Action minimizes sensory prediction error by moving the body — the same gradient that
            updates beliefs, sent outward through the reflex arc.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\dot a = -\\partial_a F = -\\big(\\partial_a \\tilde y\\big)^\\top \\varepsilon_y"
          label="Action law"
        />
      ),
    },
    {
      id: 'field',
      content: (
        <>
          <h2>Gaussian generative models give you all of this for free.</h2>
          <p>Linearize, and the free energy becomes a quadratic form with an analytic gradient.</p>
        </>
      ),
      interactive: <FreeEnergyField />,
    },
    getCoreRetrievalBeat(8),
  ];
  return (
    <StreamTemplate
      streamKey="core"
      beats={beats}
      onProgress={onProgress}
      onComplete={onComplete}
    />
  );
}
