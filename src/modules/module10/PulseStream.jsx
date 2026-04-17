/**
 * @file module10/PulseStream.jsx — The Whole Orbit (pulse)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import ConceptMap from '../../components/interactive/ConceptMap';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function PulseStream() {
  const { onProgress, onComplete } = useStreamProgress(10, 'pulse', 6);
  const beats = [
    {
      id: 'zoom-out',
      content: (
        <>
          <h2>Zoom all the way out.</h2>
          <p>
            The map below is your mental model of active inference. Every node is a chapter — every
            edge, a dependency. Touch a node; read its soul.
          </p>
          <GlossaryTermsLine moduleId={10} />
        </>
      ),
      interactive: <ConceptMap />,
    },
    {
      id: 'through-line',
      content: (
        <>
          <h2>The through-line is simple.</h2>
          <p>
            Minimize surprise. Across time, across hierarchies, across bodies. Everything else is a
            special case dressed up for a particular problem.
          </p>
        </>
      ),
    },
    {
      id: 'invitation',
      content: (
        <>
          <h2>You are now dangerous.</h2>
          <p>
            Find a question you care about — perception, addiction, climate, a robot — and ask: what
            would its A/B/C/D/E be? You can answer that now.
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
      finalLabel="Close the orbit"
    />
  );
}
