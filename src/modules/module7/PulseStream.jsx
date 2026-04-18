/**
 * @file module7/PulseStream.jsx — Discrete Worlds (pulse)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import GridWorld from '../../components/interactive/GridWorld';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function PulseStream() {
  const { onProgress, onComplete } = useStreamProgress(7, 'pulse', 6);
  const beats = [
    {
      id: 'intro',
      content: (
        <>
          <h2>Planning is imagination + grading.</h2>
          <p>
            The agent dreams each possible next step, grades it by how well it would resolve
            uncertainty and reach its goal, and picks.
          </p>
          <GlossaryTermsLine moduleId={7} />
        </>
      ),
      interactive: <GridWorld />,
    },
    {
      id: 'fog',
      content: (
        <>
          <h2>Fog is an invitation.</h2>
          <p>
            Cells the agent hasn't seen are ambiguous. Active inference loves that — it detours to
            look.
          </p>
        </>
      ),
      interactive: <GridWorld ambiguity={1.5} risk={0.7} />,
    },
    {
      id: 'curiosity',
      content: (
        <>
          <h2>Curiosity falls out of the math.</h2>
          <p>
            You didn't add a "be curious" bonus. It appeared from minimizing expected free energy.
          </p>
        </>
      ),
      interactive: <GridWorld ambiguity={1.8} risk={0.3} />,
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
