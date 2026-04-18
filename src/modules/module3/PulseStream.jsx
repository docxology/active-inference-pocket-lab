/**
 * @file module3/PulseStream.jsx — The High Road, pulse experience
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import FreeEnergyField from '../../components/interactive/FreeEnergyField';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function PulseStream() {
  const { onProgress, onComplete } = useStreamProgress(3, 'pulse', 6);
  const beats = [
    {
      id: 'alive',
      content: (
        <>
          <h2>Why stay alive?</h2>
          <p>
            A fish out of water is <em>literally surprised</em>: a gill breathing air violates
            everything the creature expects itself to be.
          </p>
          <GlossaryTermsLine moduleId={3} />
          <p>Staying alive means keeping your observations inside the bounds of "you".</p>
        </>
      ),
    },
    {
      id: 'landscape',
      content: (
        <>
          <h2>Think of it as a landscape.</h2>
          <p>
            Each spot is a configuration of beliefs. Valleys are states where your model fits the
            world. Everything else is uphill — higher free energy, harder to hold.
          </p>
        </>
      ),
      interactive: <FreeEnergyField attractorX={0.5} attractorY={0.5} />,
    },
    {
      id: 'two-moves',
      content: (
        <>
          <h2>Two moves, same goal.</h2>
          <p>
            <strong>Perception</strong> rolls the ball: update beliefs so they match observations.
            <br />
            <strong>Action</strong> re-tilts the landscape: change the world so observations match
            preferred beliefs.
          </p>
          <p>Free energy is what both are trying to shrink.</p>
        </>
      ),
    },
    {
      id: 'why-variational',
      content: (
        <>
          <h2>Why not just compute the exact posterior?</h2>
          <p>
            Because marginalizing over <em>all possible hidden states</em> is combinatorially
            explosive — for a brain, literally impossible. Variational inference trades exactness
            for speed: bound the surprise, then optimize the bound.
          </p>
          <p>
            The valley you see isn't reality — it's your brain's best <em>approximation</em> of
            reality. And that's enough.
          </p>
        </>
      ),
      interactive: <FreeEnergyField attractorX={0.3} attractorY={0.7} spread={0.35} noise={0.04} />,
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
