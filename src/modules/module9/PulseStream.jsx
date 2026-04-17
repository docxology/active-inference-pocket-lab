/**
 * @file module9/PulseStream.jsx — Model-Based Data Analysis (pulse)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import DataFitter from '../../components/interactive/DataFitter';
import { useStreamProgress } from '../shared/useStreamProgress';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';

export default function PulseStream() {
  const { onProgress, onComplete } = useStreamProgress(9, 'pulse', 6);
  const beats = [
    {
      id: 'data-as-friend',
      content: (
        <>
          <h2>Data are evidence in a court case.</h2>
          <p>
            Each model is a defendant with a story. Bayes is the judge. The model that explains the
            data best — without over-explaining — wins.
          </p>
          <GlossaryTermsLine moduleId={9} />
        </>
      ),
      interactive: <DataFitter />,
    },
    {
      id: 'fit-slider',
      content: (
        <>
          <h2>Slide μ and σ. Watch the log-evidence move.</h2>
          <p>
            You're watching Bayes' tradeoff in real time: accuracy rewards fit, complexity penalizes
            over-specification.
          </p>
        </>
      ),
    },
    {
      id: 'life-skill',
      content: (
        <>
          <h2>This is a life skill, not a math trick.</h2>
          <p>
            "Which story fits the evidence, and how much wiggle-room does it need?" — a question you
            now answer formally.
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
