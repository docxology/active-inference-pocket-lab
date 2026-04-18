/**
 * @file module3/CoreStream.jsx — The High Road, core experience
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import { useStreamProgress } from '../shared/useStreamProgress';
import { getCoreRetrievalBeat } from '../shared/getCoreRetrievalBeat';

export default function CoreStream() {
  const { onProgress, onComplete } = useStreamProgress(3, 'core', 6);
  const beats = [
    {
      id: 'jensen',
      content: (
        <>
          <h2>Jensen brought the bound.</h2>
          <p>Start with the log evidence and introduce an approximate posterior q(s).</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="-\\ln p(o) \\leq \\mathbb{E}_q[-\\ln p(o,s)] + \\mathbb{E}_q[\\ln q(s)]"
          label="Jensen's inequality on log evidence"
        />
      ),
    },
    {
      id: 'decomp',
      content: (
        <>
          <h2>Two decompositions, one functional.</h2>
          <p>
            Complexity − Accuracy, or Energy − Entropy. Both say "fit the world without inventing
            too much structure".
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="F = \\underbrace{D_{KL}[q(s)\\|p(s)]}_{\\text{complexity}} - \\underbrace{\\mathbb{E}_q[\\ln p(o\\mid s)]}_{\\text{accuracy}}"
          label="Variational free energy"
        />
      ),
    },
    {
      id: 'closure',
      content: (
        <>
          <h2>Action and perception, one principle.</h2>
          <p>
            Perception: pick q that minimizes F given observations. Action: pick observations that
            minimize F given preferred q.
          </p>
          <p>One arrow — two directions.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\frac{dq}{dt} \\propto -\\partial_q F, \\quad \\frac{da}{dt} \\propto -\\partial_a F"
          label="Dual dynamics"
        />
      ),
    },
    {
      id: 'elbo',
      content: (
        <>
          <h2>The ELBO: the right thing to maximize.</h2>
          <p>
            Flip the sign and you get the Evidence Lower BOund. Maximizing the ELBO <em>is</em>{' '}
            minimizing free energy — same knob, different name. Every VAE, every variational
            Bayesian model, every active inference agent is climbing this hill.
          </p>
          <p>
            The gap between ELBO and log evidence is exactly the KL divergence between your
            approximation q and the true posterior — zero when q is perfect, positive otherwise.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\ln p(o) = \\underbrace{\\mathbb{E}_q[\\ln p(o,s)] - \\mathbb{E}_q[\\ln q(s)]}_{\\text{ELBO} = -F} + D_{KL}[q(s)\\|p(s\\mid o)]"
          label="Log evidence = ELBO + KL gap"
          description="Maximize the ELBO, shrink the gap."
        />
      ),
    },
    getCoreRetrievalBeat(3),
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
