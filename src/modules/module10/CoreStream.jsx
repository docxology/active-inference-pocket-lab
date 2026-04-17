/**
 * @file module10/CoreStream.jsx — The Whole Orbit (core)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import ConceptMap from '../../components/interactive/ConceptMap';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function CoreStream() {
  const { onProgress, onComplete } = useStreamProgress(10, 'core', 8);
  const beats = [
    {
      id: 'single-eq',
      content: (
        <>
          <h2>One equation, ten chapters.</h2>
          <p>Perception, learning, action, planning, model selection — all minimize variants of this functional.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="F[q,\\phi] = D_{KL}[q(s)\\,\\|\\,p(s,\\phi)] - \\mathbb{E}_q[\\ln p(y\\mid s,\\phi)]"
          label="The variational free energy functional"
        />
      ),
    },
    {
      id: 'hierarchy',
      content: (
        <>
          <h2>Scales nest.</h2>
          <p>Neurons, bodies, organisms, societies — any system that persists must implement free-energy minimization on some scale. Markov blankets all the way down.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\eta \\leftrightarrow [b, \\mu]\\leftrightarrow s : \\text{Markov blanket separates internal from external}"
          label="Markov blanket factorization"
        />
      ),
    },
    {
      id: 'map',
      content: (
        <>
          <h2>Concept atlas.</h2>
          <p>Explore the connections you've built. Tap nodes to see their definitions and the modules where they live.</p>
        </>
      ),
      interactive: <ConceptMap />,
    },
    {
      id: 'open',
      content: (
        <>
          <h2>Open questions.</h2>
          <p>Scaling to real neural recordings, bridging with deep learning, formalizing multi-agent active inference, alignment as free-energy minimization of a shared model. The door is now yours.</p>
        </>
      ),
    },
  ];
  return <StreamTemplate streamKey="core" beats={beats} onProgress={onProgress} onComplete={onComplete} finalLabel="Close the orbit" />;
}
