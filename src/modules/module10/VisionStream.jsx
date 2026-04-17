/**
 * @file module10/VisionStream.jsx — The Whole Orbit (vision)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import ConceptMap from '../../components/interactive/ConceptMap';
import GlossaryChips from '../../components/interactive/GlossaryChips';
import { getModuleById } from '../../data/modules';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function VisionStream() {
  const { onProgress, onComplete } = useStreamProgress(10, 'vision', 7);
  const glossaryKeys = getModuleById(10).glossary;
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
          <GlossaryTermsLine moduleId={10} />
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
      interactive: <GlossaryChips keys={glossaryKeys} caption="Key terms" />,
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
      interactive: <ConceptMap />,
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
