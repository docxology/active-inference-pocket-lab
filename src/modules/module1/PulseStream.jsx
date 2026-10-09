/**
 * @file PulseStream.jsx — Module 1 Pulse Experience
 * @description "The Enthusiast" stream for Module 1: The First Orbit.
 *
 * High emotional content, conversational language.
 * Teaches what a generative model is through ONE interactive slider.
 * Math simplified to high-school levels.
 *
 * The First Threshold: starts with a physical action (the slider).
 *
 * @module modules/module1/PulseStream
 */
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import InferenceSlider from '../../components/interactive/InferenceSlider';
import RewardAnimation from '../../components/interactive/RewardAnimation';
import { useApp } from '../../contexts/AppContext';
import { hapticLight, hapticMedium, hapticSuccess } from '../../utils/haptics';
import GlossaryTermsLine from '../shared/GlossaryTermsLine';
import { useLearningPosition } from '../shared/useLearningPosition';
import { useStreamProgress } from '../shared/useStreamProgress';
import './PulseStream.css';

/**
 * Steps for the Pulse micro-inference experience.
 * Each step is a singular, generous screen — no walls of text.
 */
const STEPS = [
  {
    id: 'welcome',
    content: (
      <>
        <h2>What if your brain is a prediction machine?</h2>
        <p>
          Right now, your brain is generating expectations about what comes next — before you even
          finish reading this sentence.
        </p>
        <GlossaryTermsLine moduleId={1} />
        <p className="pulse-hint">
          👇 Move the slider below to set your first <strong>prior belief</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'prediction',
    content: (
      <>
        <h2>You just made a prediction.</h2>
        <p>
          That number you chose? That's your brain's <strong>best guess</strong> about what it
          expects to see. In Active Inference, we call this a <em>prior</em>.
        </p>
        <p>Now watch what happens when reality doesn't match your prediction...</p>
      </>
    ),
  },
  {
    id: 'surprise',
    content: (
      <>
        <h2>
          That gap? That's a <em>prediction error</em>.
        </h2>
        <p>
          Prediction error is the gap between your guess and the observation. Surprise also depends
          on how confident your model was. Explore that distinction in the Core sandbox.
        </p>
        <p>
          This is the core of Active Inference: you either update your beliefs or act to change the
          world. 🌀
        </p>
      </>
    ),
  },
];

/**
 * PulseStream — Module 1 Pulse experience.
 * @returns {JSX.Element}
 */
export default function PulseStream() {
  const [step, setStep] = useLearningPosition(1, 'pulse', STEPS.length);
  const [priorValue, setPriorValue] = useState(50);
  const [observedValue] = useState(() => Math.floor(Math.random() * 60) + 20);
  const [hasInteracted, setHasInteracted] = useState(step > 0);
  const [showReward, setShowReward] = useState(false);
  const { updateProgress } = useApp();
  const { onComplete } = useStreamProgress(1, 'pulse');
  const [completed, setCompleted] = useState(false);

  const surprise = Math.abs(priorValue - observedValue);
  const normalizedSurprise = surprise / 100;

  const handleSliderChange = useCallback(
    (value) => {
      setPriorValue(value);
      hapticLight();
      if (!hasInteracted) {
        setHasInteracted(true);
        console.log('[PulseStream] First interaction — threshold crossed');
      }
    },
    [hasInteracted],
  );

  const advanceStep = useCallback(() => {
    if (completed) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      hapticMedium();
      // Update progress per-step
      updateProgress(1, 'pulse', Math.round(((step + 1) / STEPS.length) * 100));
      console.log(`[PulseStream] Advanced to step ${step + 1}`);
    } else {
      // Module complete!
      setShowReward(true);
      hapticSuccess();
      setCompleted(true);
      onComplete();
      console.log('[PulseStream] Module 1 Pulse complete!');
    }
  }, [step, updateProgress, setStep, onComplete, completed]);

  const currentStep = STEPS[step];

  return (
    <div
      className="pulse-stream stream-pulse"
      role="tabpanel"
      aria-labelledby="stream-tab-pulse"
      id="stream-panel-pulse"
    >
      {/* The Slider — The First Threshold */}
      <div className="pulse-stream__interaction">
        <InferenceSlider
          min={0}
          max={100}
          value={priorValue}
          onChange={handleSliderChange}
          label="Your Prior Belief"
          leftLabel="Low"
          rightLabel="High"
          color="var(--color-pulse)"
        />

        {/* Surprise Meter */}
        {hasInteracted && step >= 1 && (
          <motion.div
            className="pulse-stream__surprise"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="pulse-stream__surprise-label">
              <span>Prediction error</span>
              <span className="pulse-stream__surprise-value">{surprise}</span>
            </div>
            <div className="pulse-stream__surprise-bar">
              <motion.div
                className="pulse-stream__surprise-fill"
                animate={{ width: `${normalizedSurprise * 100}%` }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  background:
                    surprise > 50
                      ? 'var(--color-error)'
                      : surprise > 25
                        ? 'var(--color-warning)'
                        : 'var(--color-success)',
                }}
              />
            </div>
            <p className="pulse-stream__surprise-hint">
              Observed value: <strong>{observedValue}</strong> —
              {surprise < 10
                ? ' Almost no surprise!'
                : surprise > 50
                  ? ' High surprise! Your brain wants to update.'
                  : ' Some surprise. A learning opportunity.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep.id}
        className="pulse-stream__content"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {currentStep.content}
      </motion.div>

      {/* Step Progress & Continue */}
      <div className="pulse-stream__footer">
        <div className="pulse-stream__progress">
          {STEPS.map((s, i) => (
            <span key={s.id} className={`pulse-stream__dot ${i <= step ? 'active' : ''}`} />
          ))}
        </div>

        {hasInteracted && (
          <motion.button
            className="pulse-stream__continue"
            disabled={completed}
            onClick={advanceStep}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {completed ? 'Complete ✓' : step < STEPS.length - 1 ? 'Continue →' : 'Complete 🌀'}
          </motion.button>
        )}
      </div>

      {/* Reward */}
      <RewardAnimation
        active={showReward}
        onComplete={() => setShowReward(false)}
        message="Spin!"
      />
    </div>
  );
}
