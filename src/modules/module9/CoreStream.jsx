/**
 * @file module9/CoreStream.jsx — Model-Based Data Analysis (core)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MathBlock from '../../components/interactive/MathBlock';
import DataFitter from '../../components/interactive/DataFitter';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function CoreStream() {
  const { onProgress, onComplete } = useStreamProgress(9, 'core', 8);
  const beats = [
    {
      id: 'fe-bound',
      content: (
        <>
          <h2>Free energy is a tight bound on log evidence.</h2>
          <p>Minimize F, maximize ln p(y∣M). Identical in the Gaussian limit; numerically the same dial.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="-F(q,y) \\le \\ln p(y\\mid M),\\quad \\text{with equality iff } q=p(\\cdot\\mid y,M)"
          label="Jensen-tight bound on evidence"
        />
      ),
    },
    {
      id: 'bms',
      content: (
        <>
          <h2>Random-effects Bayesian model selection.</h2>
          <p>Treat the model <em>index</em> as a latent Dirichlet variable across subjects. Compute expected exceedance probabilities.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="p(r\\mid y) \\propto \\mathrm{Dir}(r\\mid\\alpha_0) \\prod_n \\sum_k r_k\\, p(y_n\\mid M_k)"
          label="RFX-BMS generative model"
        />
      ),
    },
    {
      id: 'peb',
      content: (
        <>
          <h2>Parametric Empirical Bayes.</h2>
          <p>Second-level model pools subject-level posteriors, shrinks noisy estimates toward a group mean, reveals between-subject effects.</p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="p(\\theta\\mid y) = \\int p(\\theta\\mid y,\\eta)\\,p(\\eta\\mid y)\\,d\\eta"
          label="Two-level empirical Bayes"
        />
      ),
    },
    {
      id: 'hands-on',
      content: (
        <>
          <h2>Touch the bound.</h2>
          <p>Drag the Gaussian and watch log evidence climb and fall. This is all a model comparison tool ever does.</p>
        </>
      ),
      interactive: <DataFitter />,
    },
  ];
  return <StreamTemplate streamKey="core" beats={beats} onProgress={onProgress} onComplete={onComplete} />;
}
