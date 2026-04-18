/**
 * @file module4/CoreStream.jsx — Generative Architecture (core)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import { useStreamProgress } from '../shared/useStreamProgress';
import { getCoreRetrievalBeat } from '../shared/getCoreRetrievalBeat';

export default function CoreStream() {
  const { onProgress, onComplete } = useStreamProgress(4, 'core', 6);
  const beats = [
    {
      id: 'joint',
      content: (
        <>
          <h2>The joint is the model.</h2>
          <p>
            A generative model is a recipe for the joint p(o, s) — everything else factorizes from
            here.
          </p>
        </>
      ),
      interactive: <MathBlock latex="p(o,s) = p(o\\mid s)\\, p(s)" label="Joint factorization" />,
    },
    {
      id: 'hier',
      content: (
        <>
          <h2>Hierarchies nest.</h2>
          <p>
            Each layer's prior is the next layer's likelihood. Conditional independence makes
            message passing tractable.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="p(s^1, \\ldots, s^L) = \\prod_{\\ell=1}^{L-1} p(s^\\ell \\mid s^{\\ell+1})"
          label="Hierarchical factorization"
        />
      ),
    },
    {
      id: 'conjugate',
      content: (
        <>
          <h2>Choose conjugate pairs.</h2>
          <p>
            Gaussian-Gaussian. Categorical-Dirichlet. Conjugate pairs keep your updates analytic —
            and your equations legible.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\mathcal{N}(\\mu_0, \\sigma_0^2) \\times \\mathcal{N}(x; \\mu, \\sigma^2) \\propto \\mathcal{N}\\!\\left(\\frac{\\sigma_0^2 x + \\sigma^2 \\mu_0}{\\sigma_0^2 + \\sigma^2},\\; \\frac{\\sigma_0^2\\sigma^2}{\\sigma_0^2+\\sigma^2}\\right)"
          label="Gaussian conjugate update"
          description="The posterior of a Gaussian model under Gaussian observations is also Gaussian — no approximation needed."
        />
      ),
    },
    getCoreRetrievalBeat(4),
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
