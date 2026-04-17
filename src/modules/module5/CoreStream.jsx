/**
 * @file module5/CoreStream.jsx — Message Passing (core)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import { useStreamProgress } from '../shared/useStreamProgress';
import { getCoreRetrievalBeat } from '../shared/getCoreRetrievalBeat';

export default function CoreStream() {
  const { onProgress, onComplete } = useStreamProgress(5, 'core', 6);
  const beats = [
    {
      id: 'bp',
      content: (
        <>
          <h2>Belief propagation, precisely.</h2>
          <p>On a tree-structured factor graph BP returns exact marginals.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="m_{i\\to j}(s_j) \\propto \\sum_{s_i} \\psi_{ij}(s_i, s_j)\\prod_{k\\ne j} m_{k\\to i}(s_i)"
          label="Belief propagation"
        />
      ),
    },
    {
      id: 'pe',
      content: (
        <>
          <h2>Predictive coding = residual messages.</h2>
          <p>
            The signal a pyramidal cell broadcasts upward is exactly the precision-weighted error.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\varepsilon^{(\\ell)} = \\pi^{(\\ell)} \\big(o^{(\\ell)} - g(\\mu^{(\\ell+1)})\\big)"
          label="Cortical prediction error"
        />
      ),
    },
    {
      id: 'marg',
      content: (
        <>
          <h2>Loopy graphs? Mean-field rescues you.</h2>
          <p>Variational / marginal message passing gives you tractable, good-enough inference.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="q_i(s_i) \\propto \\exp\\!\\Big(\\mathbb{E}_{q_{\\neg i}}[\\ln p(s, o)]\\Big)"
          label="Mean-field update"
        />
      ),
    },
    getCoreRetrievalBeat(5),
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
