/**
 * @file module6/CoreStream.jsx — A Recipe for Designing Models (core)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import ModelRecipe from '../../components/interactive/ModelRecipe';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function CoreStream() {
  const { onProgress, onComplete } = useStreamProgress(6, 'core', 7);
  const beats = [
    {
      id: 'spec',
      content: (
        <>
          <h2>Discrete POMDP spec.</h2>
          <p>
            All five matrices live in a sparse tensor network. Their dimensions tell you the state
            space.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="A_{o,s} = p(o\\mid s),\\quad B_{s',s,u} = p(s'\\mid s,u),\\quad C_o = \\ln \\tilde{p}(o)"
          label="Generative model (categorical form)"
        />
      ),
    },
    {
      id: 'efe',
      content: (
        <>
          <h2>Expected free energy.</h2>
          <p>
            Each policy π is scored by its expected ambiguity plus risk. Curiosity drops out for
            free.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="G(\\pi) = \\mathbb{E}_{q}\\big[\\mathrm{H}[p(o\\mid s)]\\big] + D_{KL}[q(o\\mid\\pi)\\|\\tilde p(o)]"
          label="Expected free energy"
        />
      ),
    },
    {
      id: 'sim',
      content: (
        <>
          <h2>Flip through the ingredients.</h2>
          <p>Small edits to A or C change the agent's personality and preferences dramatically.</p>
        </>
      ),
      interactive: <ModelRecipe />,
    },
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
