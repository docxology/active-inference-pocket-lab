/**
 * @file Quiz.jsx — Module Micro-Quiz
 * @description Three-question retrieval check at the end of a module.
 * Generous feedback, no timers, no public scores — just clarity.
 *
 * Philosophy: quizzes are learning moments, not gates.
 *
 * @module components/interactive/Quiz
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticLight, hapticSuccess } from '../../utils/haptics';
import { useActivityBank } from '../../contexts/ActivityBankContext';
import './Quiz.css';

/**
 * @typedef {Object} QuizProps
 * @property {Array<{prompt:string, options:string[], correctIndex:number, explanation:string}>} questions
 * @property {(score: number, total: number) => void} [onComplete]
 * @property {string} [title]
 */

/**
 * Quiz — Renders a small set of MCQ questions with gentle feedback.
 *
 * @param {QuizProps} props
 * @returns {JSX.Element}
 */
export default function Quiz({ questions, onComplete, title = 'Retrieval' }) {
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const { recordQuiz } = useActivityBank();

  const score = useMemo(
    () => answers.reduce((s, a, i) => s + (a === questions[i].correctIndex ? 1 : 0), 0),
    [answers, questions],
  );

  const allAnswered = answers.every((a) => a !== null);
  const passed = submitted && score >= Math.ceil(questions.length * 0.66);

  const handleSelect = (qi, oi) => {
    if (submitted) return;
    hapticLight();
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    hapticSuccess();
    const didPass = score >= Math.ceil(questions.length * 0.66);
    recordQuiz(didPass);
    onComplete?.(score, questions.length);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  return (
    <section className="quiz" aria-label={title}>
      <header className="quiz__header">
        <h3 className="quiz__title">{title}</h3>
        <p className="quiz__subtitle">Three questions — no timer, no streak penalty.</p>
      </header>

      <ol className="quiz__questions">
        {questions.map((q, qi) => {
          const selected = answers[qi];
          return (
            <li key={qi} className="quiz__question">
              <p className="quiz__prompt">{q.prompt}</p>
              <div className="quiz__options">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isCorrect = submitted && oi === q.correctIndex;
                  const isWrong = submitted && isSelected && oi !== q.correctIndex;
                  return (
                    <button
                      key={oi}
                      className={[
                        'quiz__option',
                        isSelected ? 'selected' : '',
                        isCorrect ? 'correct' : '',
                        isWrong ? 'wrong' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => handleSelect(qi, oi)}
                      aria-pressed={isSelected}
                      disabled={submitted}
                    >
                      <span className="quiz__option-marker">{String.fromCharCode(65 + oi)}</span>
                      <span className="quiz__option-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {submitted && (
                  <motion.p
                    className="quiz__explanation"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <strong>{selected === q.correctIndex ? '✓ Nice.' : '→ '}</strong>
                    {q.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      <div className="quiz__footer">
        {!submitted ? (
          <button
            className="quiz__submit"
            onClick={handleSubmit}
            disabled={!allAnswered}
            aria-disabled={!allAnswered}
          >
            {allAnswered ? 'Check my thinking' : `Answer all ${questions.length} first`}
          </button>
        ) : (
          <div className="quiz__result" role="status" aria-live="polite">
            <span className="quiz__score">
              {score}/{questions.length}
            </span>
            <span className="quiz__verdict">
              {passed ? 'Clear enough. Good orbit. 🌀' : 'A useful pass — look at the notes above.'}
            </span>
            <button className="quiz__reset" onClick={handleReset}>
              Try again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
