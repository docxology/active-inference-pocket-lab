/**
 * @file module5/PulseStream.jsx — Message Passing (pulse)
 */
import StreamTemplate from '../../components/layout/StreamTemplate';
import MessagePassingCircuit from '../../components/interactive/MessagePassingCircuit';
import { useStreamProgress } from '../shared/useStreamProgress';

export default function PulseStream() {
  const { onProgress, onComplete } = useStreamProgress(5, 'pulse', 5);
  const beats = [
    {
      id: 'chat',
      content: (
        <>
          <h2>Your neurons are gossiping.</h2>
          <p>
            Pyramidal cells push predictions downward — "this is probably a cat". Bottom-up circuits
            push back with <em>prediction errors</em> — "the whiskers don't match".
          </p>
        </>
      ),
      interactive: <MessagePassingCircuit />,
    },
    {
      id: 'volume',
      content: (
        <>
          <h2>Precision is the volume knob.</h2>
          <p>Attention is a precision boost. Whichever side turns up wins the conversation.</p>
        </>
      ),
      interactive: <MessagePassingCircuit precision={1.4} drive={0.8} />,
    },
    {
      id: 'silence',
      content: (
        <>
          <h2>When the whisper matches, silence.</h2>
          <p>Perfect prediction sends no error. Most of what your cortex does is verify a hunch.</p>
        </>
      ),
      interactive: <MessagePassingCircuit precision={0.4} drive={1.2} />,
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
