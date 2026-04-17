/**
 * @file module6/VisionStream.jsx — A Recipe for Designing Models (vision)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import ModelRecipe from '../../components/interactive/ModelRecipe';
import GenerativeGraph from '../../components/interactive/GenerativeGraph';
import GlossaryChips from '../../components/interactive/GlossaryChips';
import { getModuleById } from '../../data/modules';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function VisionStream() {
  const { onProgress, onComplete } = useStreamProgress(6, 'vision', 6);
  const glossaryKeys = getModuleById(6).glossary;
  const beats = [
    {
      id: 'map',
      content: (
        <>
          <h2>The recipe, visualized.</h2>
          <p>
            Every ingredient maps to an edge or node in a generative graph. Tap the tabs to see each
            matrix — its values determine the story.
          </p>
          <GlossaryTermsLine moduleId={6} />
        </>
      ),
      interactive: <ModelRecipe />,
    },
    {
      id: 'graph',
      content: (
        <>
          <h2>Assembly.</h2>
          <p>
            Pour A, B, C, D into a tiny POMDP, and a generative graph like this one falls out. The
            agent's "mind" is literally its wiring diagram.
          </p>
        </>
      ),
      interactive: <GenerativeGraph />,
    },
    {
      id: 'debug',
      content: (
        <>
          <h2>Debug by ingredient.</h2>
          <p>Agent obsessed with fog? Check C. Agent freezes? Check B's diagonal dominance.</p>
        </>
      ),
      interactive: <GlossaryChips keys={glossaryKeys.slice(0, 4)} />,
    },
  ];
  return (
    <StreamTemplate
      streamKey="vision"
      beats={beats}
      onProgress={onProgress}
      onComplete={onComplete}
    />
  );
}
