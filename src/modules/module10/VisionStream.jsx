/**
 * @file module10/VisionStream.jsx — The Whole Orbit (vision)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import ConceptMap from '../../components/interactive/ConceptMap';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function VisionStream() {
  const { onProgress, onComplete } = useStreamProgress(10, 'vision', 7);
  const beats = [
    {
      id: 'map',
      content: (
        <>
          <h2>The whole territory in one picture.</h2>
          <p>
            Bayes at the center. Free energy orbits. Active inference is the outer ring where
            perception, planning, and action meet.
          </p>
        </>
      ),
      interactive: <ConceptMap />,
    },
    {
      id: 'aesthetics',
      content: (
        <>
          <h2>Active inference is an aesthetic.</h2>
          <p>
            A preference for generative over discriminative, for <em>why</em> over <em>what</em>,
            for uncertainty as a first-class citizen. Once you see it, you'll see it everywhere.
          </p>
        </>
      ),
    },
    {
      id: 'synth',
      content: (
        <>
          <h2>Return to the first lesson.</h2>
          <p>
            Perception was prediction. Learning was belief-updating. Action was policy selection.
            Now, all of it lives on one page.
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
      finalLabel="Close the orbit"
    />
  );
}
