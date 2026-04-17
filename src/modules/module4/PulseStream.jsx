/**
 * @file module4/PulseStream.jsx — Generative Architecture (pulse)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import GenerativeGraph from '../../components/interactive/GenerativeGraph';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function PulseStream() {
  const { onProgress, onComplete } = useStreamProgress(4, 'pulse', 5);
  const beats = [
    {
      id: 'recipe',
      content: (
        <>
          <h2>Generative models are recipes.</h2>
          <p>
            Hidden ingredients → observations. Pick the right ingredients, and the world generates
            itself in your head.
          </p>
          <GlossaryTermsLine moduleId={4} />
        </>
      ),
      interactive: <GenerativeGraph precision={1} />,
    },
    {
      id: 'hierarchy',
      content: (
        <>
          <h2>Hierarchy does the heavy lifting.</h2>
          <p>
            Fast features (edges, phonemes) feed slow ones (objects, stories). Your brain runs
            thousands of these recipes simultaneously.
          </p>
        </>
      ),
      interactive: <GenerativeGraph precision={1.4} highlight="s3" />,
    },
    {
      id: 'power',
      content: (
        <>
          <h2>Every expectation is a recipe in motion.</h2>
          <p>
            You don't see — you <em>cook up</em> visions using priors and sensation as spices.
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
