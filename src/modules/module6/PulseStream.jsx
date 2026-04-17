/**
 * @file module6/PulseStream.jsx — A Recipe for Designing Models (pulse)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import ModelRecipe from '../../components/interactive/ModelRecipe';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function PulseStream() {
  const { onProgress, onComplete } = useStreamProgress(6, 'pulse', 6);
  const beats = [
    {
      id: 'ingredients',
      content: (
        <>
          <h2>Five ingredients. Infinite worlds.</h2>
          <p>
            <strong>A</strong> is how states look. <strong>B</strong> is how they move.
            <strong> C</strong> is what you want. <strong>D</strong> is where you start.
            <strong> E</strong> is your habits.
          </p>
          <GlossaryTermsLine moduleId={6} />
        </>
      ),
      interactive: <ModelRecipe />,
    },
    {
      id: 'intuition',
      content: (
        <>
          <h2>Change C, change behavior.</h2>
          <p>
            The goals you write into C propagate all the way to policy selection. Preferences are
            just priors on what you'd like to see.
          </p>
        </>
      ),
    },
    {
      id: 'lift',
      content: (
        <>
          <h2>
            You're allowed to <em>design</em> minds.
          </h2>
          <p>
            That's the radical claim: a careful A/B/C/D/E spec is a full description of a tiny
            agent's world. You'll build one next chapter.
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
