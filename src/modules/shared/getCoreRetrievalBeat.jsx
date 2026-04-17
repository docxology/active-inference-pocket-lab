/**
 * @file getCoreRetrievalBeat.jsx — Final Core beat from registry quiz
 * @module modules/shared/getCoreRetrievalBeat
 */
import ModuleRetrievalQuiz from './ModuleRetrievalQuiz';

/**
 * Final StreamTemplate beat: micro-quiz from {@link modules.js} registry.
 *
 * @param {number} moduleId
 * @returns {Object} StreamTemplate beat
 */
export function getCoreRetrievalBeat(moduleId) {
  return {
    id: 'retrieval',
    content: (
      <>
        <h2>Check understanding</h2>
        <p>Three quick questions — no timer, clarity only.</p>
      </>
    ),
    interactive: <ModuleRetrievalQuiz moduleId={moduleId} />,
  };
}
