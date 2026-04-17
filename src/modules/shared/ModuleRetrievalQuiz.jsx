/**
 * @file ModuleRetrievalQuiz.jsx — Registry quiz for Core layouts
 * @module modules/shared/ModuleRetrievalQuiz
 */
import Quiz from '../../components/interactive/Quiz';
import { getModuleById } from '../../data/modules';

/**
 * Standalone quiz block for custom Core layouts (e.g. Module 1).
 *
 * @param {Object} props
 * @param {number} props.moduleId
 */
export default function ModuleRetrievalQuiz({ moduleId }) {
  const mod = getModuleById(moduleId);
  return <Quiz questions={mod.quiz} title={`${mod.title} — retrieval`} />;
}
