/**
 * @file module7/CoreStream.jsx — Discrete Worlds (core)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import GridWorld from '../../components/interactive/GridWorld';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function CoreStream() {
  const { onProgress, onComplete } = useStreamProgress(7, 'core', 8);
  const beats = [
    {
      id: 'efe-decomp',
      content: (
        <>
          <h2>EFE, decomposed.</h2>
          <p>
            Ambiguity is <em>expected entropy over outcomes given states</em>. Risk is KL between
            expected observations and preferred observations. Their sum drives exploration +
            exploitation.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="G(\\pi)=\\underbrace{\\mathbb{E}_{q(s\\mid\\pi)}\\!\\big[\\mathrm{H}[p(o\\mid s)]\\big]}_{\\text{ambiguity}} + \\underbrace{D_{KL}\\!\\big[q(o\\mid\\pi)\\,\\|\\,\\tilde p(o)\\big]}_{\\text{risk}}"
          label="Expected free energy of a policy"
        />
      ),
    },
    {
      id: 'softmax',
      content: (
        <>
          <h2>From score to action.</h2>
          <p>
            Softmax with inverse temperature γ converts EFE scores into a policy distribution.
            High γ = greedy; low γ = exploratory. Boltzmann's ghost in the agent.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="q(\\pi) = \\sigma\\!\\left(-\\gamma\\, G(\\pi) + \\ln E(\\pi)\\right)"
          label="Policy posterior"
        />
      ),
    },
    {
      id: 'grid',
      content: (
        <>
          <h2>Everything above — in a 4×4 grid.</h2>
          <p>The whole apparatus reduces to a few matrix multiplies per tick. Toy, but truthful.</p>
        </>
      ),
      interactive: <GridWorld risk={1} ambiguity={1} />,
    },
  ];
  return <StreamTemplate streamKey="core" beats={beats} onProgress={onProgress} onComplete={onComplete} />;
}
