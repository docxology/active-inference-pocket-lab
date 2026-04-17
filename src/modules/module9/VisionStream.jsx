/**
 * @file module9/VisionStream.jsx — Model-Based Data Analysis (vision)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import DataFitter from '../../components/interactive/DataFitter';
import MathBlock from '../../components/interactive/MathBlock';
import GlossaryChips from '../../components/interactive/GlossaryChips';
import { getModuleById } from '../../data/modules';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function VisionStream() {
  const { onProgress, onComplete } = useStreamProgress(9, 'vision', 7);
  const glossaryKeys = getModuleById(9).glossary;
  const beats = [
    {
      id: 'evidence',
      content: (
        <>
          <h2>Model evidence, visualized.</h2>
          <p>
            The Gaussian rises and falls as you tune it. Log-evidence is how <em>surprising</em> the
            data are under the model — minimize surprise, maximize evidence.
          </p>
          <GlossaryTermsLine moduleId={9} />
        </>
      ),
      interactive: <DataFitter />,
    },
    {
      id: 'compare',
      content: (
        <>
          <h2>Compare by subtracting.</h2>
          <p>
            Two models, two log-evidences. Their difference is the <em>log Bayes factor</em> — how
            many "units of explanation" one model has over another.
          </p>
        </>
      ),
      interactive: (
        <MathBlock
          latex="\\ln \\mathrm{BF}_{12} = \\ln p(y\\mid M_1) - \\ln p(y\\mid M_2)"
          label="Log Bayes factor"
        />
      ),
    },
    {
      id: 'group',
      content: (
        <>
          <h2>Group studies, pooled by hierarchy.</h2>
          <p>
            DCM, PEB, and friends: pool model evidence across subjects via hierarchical priors.
            Science as a generative model of minds.
          </p>
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
