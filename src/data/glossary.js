/**
 * @file glossary.js — Active Inference Terms
 * @description Plain-language, mathematically-accurate definitions for every
 * term the modules rely on. Each entry is keyed by a stable slug consumed by
 * module metadata (`glossary: [...]`) and the Glossary page.
 *
 * @module data/glossary
 */

/**
 * @typedef {Object} GlossaryEntry
 * @property {string} term - Display name.
 * @property {string} short - Two-sentence plain-language definition.
 * @property {string} formal - Math-aware definition for the Core stream.
 * @property {string[]} [relatedModules] - Module slugs where it appears.
 * @property {string} [latex] - Optional canonical equation.
 */

/** @type {Record<string, GlossaryEntry>} */
const glossary = {
  prior: {
    term: 'Prior',
    short:
      "The brain's best guess about the world before new data arrives. Priors are the starting point of every inference.",
    formal: 'p(s): probability distribution over hidden states s prior to observing o.',
    latex: 'p(s)',
    relatedModules: ['the-first-orbit', 'the-low-road'],
  },
  observation: {
    term: 'Observation',
    short:
      'Any piece of sensory data the agent receives. Observations update priors into posteriors.',
    formal: 'o: sampled value from the likelihood p(o|s).',
    latex: 'o \\sim p(o|s)',
    relatedModules: ['the-first-orbit', 'the-low-road'],
  },
  posterior: {
    term: 'Posterior',
    short: 'What the agent believes after observing. The posterior combines prior with likelihood.',
    formal: "Bayes' rule: p(s|o) = p(o|s) p(s) / p(o).",
    latex: 'p(s|o) = \\frac{p(o|s)p(s)}{p(o)}',
    relatedModules: ['the-low-road'],
  },
  likelihood: {
    term: 'Likelihood',
    short:
      "How probable an observation is under a given hidden state. It's how the world 'looks' from inside the model.",
    formal: 'p(o|s) viewed as a function of s for fixed o.',
    latex: 'p(o|s)',
    relatedModules: ['the-low-road', 'the-generative-architecture'],
  },
  surprise: {
    term: 'Surprise (surprisal)',
    short:
      'The information content of an observation under the model. Low-probability observations carry many bits of surprise.',
    formal: '−ln p(o). Minimising surprise keeps systems within expected bounds.',
    latex: '-\\ln p(o)',
    relatedModules: ['the-first-orbit', 'the-high-road'],
  },
  freeEnergy: {
    term: 'Variational Free Energy',
    short:
      'A tractable upper bound on surprise. Minimising it is how brains (and cells) approximate Bayesian inference.',
    formal: 'F = D_KL[q(s) ∥ p(s|o)] + (−ln p(o)); equivalently F = Complexity − Accuracy.',
    latex: 'F = D_{KL}[q(s) \\| p(s|o)] - \\ln p(o)',
    relatedModules: ['the-first-orbit', 'the-high-road'],
  },
  expectedFreeEnergy: {
    term: 'Expected Free Energy',
    short:
      'The free energy of the future given a policy. Ranks plans by how much they will resolve uncertainty and seek preferred outcomes.',
    formal: 'G(π) = E_q[ln q(s|π) − ln p(o,s|π)]; decomposes into ambiguity + risk.',
    latex: 'G(\\pi) = \\text{Ambiguity} + \\text{Risk}',
    relatedModules: ['discrete-worlds', 'designing-models'],
  },
  kl: {
    term: 'KL Divergence',
    short: 'Asymmetric distance between two distributions. Zero only when they are identical.',
    formal: 'D_KL[q∥p] = E_q[ln q(s) − ln p(s)]. Non-negative.',
    latex: 'D_{KL}[q \\| p] = \\mathbb{E}_q[\\ln q - \\ln p]',
    relatedModules: ['the-high-road'],
  },
  entropy: {
    term: 'Entropy',
    short: 'Average surprise under a distribution. High entropy = spread-out beliefs.',
    formal: 'H[q] = −E_q[ln q(s)].',
    latex: 'H[q] = -\\mathbb{E}_q[\\ln q]',
    relatedModules: ['the-high-road'],
  },
  precision: {
    term: 'Precision',
    short:
      'The inverse of variance — how confident a belief is. Higher precision = tighter distribution.',
    formal: 'π = 1/σ². Precision-weighting governs message weight.',
    latex: '\\pi = 1/\\sigma^2',
    relatedModules: ['the-low-road', 'message-passing'],
  },
  generativeModel: {
    term: 'Generative Model',
    short: 'The recipe the brain uses to imagine observations. Specifies p(o, s).',
    formal: 'Joint density p(o, s) = p(o|s)p(s), potentially hierarchical.',
    latex: 'p(o, s) = p(o|s)\\,p(s)',
    relatedModules: ['the-first-orbit', 'the-generative-architecture'],
  },
  hierarchical: {
    term: 'Hierarchical Model',
    short: 'A stack of priors and likelihoods where slow layers constrain fast ones.',
    formal: 'p(s¹ … sᴸ) = ∏ p(sˡ | sˡ⁺¹).',
    latex: 'p(s^1 \\dots s^L) = \\prod_\\ell p(s^\\ell|s^{\\ell+1})',
    relatedModules: ['the-generative-architecture', 'message-passing'],
  },
  attractor: {
    term: 'Attractor',
    short:
      'A region of state space that trajectories are pulled toward. Living systems are slow attractors.',
    formal: 'Fixed points or limit sets of a dynamical system where ẋ = 0 or behavior is bounded.',
    relatedModules: ['the-high-road', 'continuous-flow'],
  },
  variationalInference: {
    term: 'Variational Inference',
    short:
      'Turning inference into optimisation: pick a simpler density q that is close to the true posterior.',
    formal: 'Minimise F[q] over a family of densities q(s).',
    latex: '\\arg\\min_q F[q(s)]',
    relatedModules: ['the-high-road', 'model-based-analysis'],
  },
  predictiveCoding: {
    term: 'Predictive Coding',
    short: 'A neural implementation of free-energy minimisation using prediction errors.',
    formal:
      'Hierarchical Gaussian model with precision-weighted prediction errors ε = π (o − g(μ)).',
    latex: '\\varepsilon = \\pi(o - g(\\mu))',
    relatedModules: ['the-low-road', 'message-passing'],
  },
  bayes: {
    term: "Bayes' Theorem",
    short: 'The formal rule for updating beliefs given evidence.',
    formal: 'p(s|o) ∝ p(o|s) p(s).',
    latex: 'p(s|o) \\propto p(o|s)p(s)',
    relatedModules: ['the-low-road'],
  },
  messagePassing: {
    term: 'Message Passing',
    short: 'Local computations on a graph whose sum approximates global inference.',
    formal: 'Belief propagation / variational message passing on factor graphs.',
    relatedModules: ['message-passing'],
  },
  beliefPropagation: {
    term: 'Belief Propagation',
    short: 'A message-passing algorithm that is exact on trees.',
    formal:
      'Recursive computation of marginals via factor-to-variable and variable-to-factor messages.',
    relatedModules: ['message-passing'],
  },
  matrixA: {
    term: 'A matrix (Likelihood)',
    short: 'Probability of each observation given each hidden state in discrete POMDPs.',
    formal: 'A[o, s] = p(o|s).',
    latex: 'A_{o,s} = p(o|s)',
    relatedModules: ['designing-models'],
  },
  matrixB: {
    term: 'B matrix (Transition)',
    short: 'Probability that state transitions given a control.',
    formal: "B[s', s, u] = p(s'|s, u).",
    latex: "B_{s',s,u} = p(s'|s,u)",
    relatedModules: ['designing-models'],
  },
  matrixC: {
    term: 'C vector (Preferences)',
    short: 'Prior preferences over observations — what the agent wants to see.',
    formal: 'C[o] = ln p̃(o).',
    latex: 'C_o = \\ln \\tilde p(o)',
    relatedModules: ['designing-models'],
  },
  matrixD: {
    term: 'D vector (Initial state prior)',
    short: 'Prior probability of starting in each hidden state.',
    formal: 'D[s] = p(s₀ = s).',
    latex: 'D_s = p(s_0 = s)',
    relatedModules: ['designing-models'],
  },
  transition: {
    term: 'Transition Model',
    short: 'How the world evolves from step to step, given actions.',
    formal: 'p(s_{t+1} | s_t, u_t).',
    relatedModules: ['designing-models', 'discrete-worlds'],
  },
  policy: {
    term: 'Policy',
    short: 'A candidate sequence of actions the agent could take.',
    formal: 'π = (u_1, …, u_T). Posterior over policies q(π).',
    relatedModules: ['discrete-worlds', 'designing-models'],
  },
  pomdp: {
    term: 'POMDP',
    short:
      'Partially Observable Markov Decision Process. The standard discrete-time generative model.',
    formal: 'Tuple ⟨S, A, O, T, Ω, R⟩ replaced by A/B/C/D/E in Active Inference.',
    relatedModules: ['discrete-worlds'],
  },
  ambiguity: {
    term: 'Ambiguity',
    short: 'Expected entropy of the likelihood — how uncertain future observations will be.',
    formal: 'E_q[ H[p(o|s)] ].',
    latex: '\\mathbb{E}_q[H[p(o|s)]]',
    relatedModules: ['discrete-worlds'],
  },
  risk: {
    term: 'Risk',
    short: 'Divergence of expected outcomes from preferred outcomes.',
    formal: 'D_KL[q(o|π) ∥ p(o)].',
    latex: 'D_{KL}[q(o|\\pi) \\| p(o)]',
    relatedModules: ['discrete-worlds'],
  },
  generalizedCoordinates: {
    term: 'Generalized Coordinates',
    short: 'States plus their temporal derivatives. A local Taylor series of the trajectory.',
    formal: 'x̃ = (x, x′, x″, …).',
    latex: '\\tilde{x} = (x, x\\prime, x\\prime\\prime, \\ldots)',
    relatedModules: ['continuous-flow'],
  },
  langevin: {
    term: 'Langevin Dynamics',
    short: 'Stochastic differential equations that combine gradient flow with noise.',
    formal: 'dx = −∂F/∂x dt + √(2D) dW.',
    latex: 'dx = -\\partial_x F\\, dt + \\sqrt{2D}\\,dW',
    relatedModules: ['continuous-flow'],
  },
  gradientFlow: {
    term: 'Gradient Flow',
    short: 'Trajectories that descend along the steepest slope of a landscape.',
    formal: 'ẋ = −∂F/∂x.',
    latex: '\\dot{x} = -\\partial_x F',
    relatedModules: ['continuous-flow'],
  },
  proprioception: {
    term: 'Proprioception',
    short: "Sensation of body position and motion; how the motor system 'listens' to itself.",
    formal: 'Prediction errors in proprioceptive channels drive motor action via the reflex arc.',
    relatedModules: ['continuous-flow'],
  },
  modelEvidence: {
    term: 'Model Evidence',
    short:
      "How much the data support a model, averaged over parameters. Also 'marginal likelihood'.",
    formal: 'p(o|m) = ∫ p(o|θ, m) p(θ|m) dθ.',
    latex: 'p(o|m) = \\int p(o|\\theta,m)p(\\theta|m)d\\theta',
    relatedModules: ['model-based-analysis'],
  },
  bayesFactor: {
    term: 'Bayes Factor',
    short: 'Ratio of model evidences. Quantifies strength of evidence between two models.',
    formal: 'B_12 = p(o|m_1)/p(o|m_2).',
    latex: 'B_{12} = \\frac{p(o|m_1)}{p(o|m_2)}',
    relatedModules: ['model-based-analysis'],
  },
  variationalLaplace: {
    term: 'Variational Laplace',
    short: 'Approximate posterior as a multivariate Gaussian around the mode.',
    formal: 'q(θ) = N(μ, Σ), with Σ = (−∂²_θ ln p(o, θ))⁻¹ at μ.',
    relatedModules: ['model-based-analysis'],
  },
  bms: {
    term: 'Bayesian Model Selection',
    short: 'Pick the model with the highest evidence across subjects or conditions.',
    formal: 'Random-effects BMS uses a Dirichlet prior over model frequencies.',
    relatedModules: ['model-based-analysis'],
  },
  markovBlanket: {
    term: 'Markov Blanket',
    short: 'The statistical shell that separates a thing from its outside world.',
    formal:
      'For a node s, its blanket is parents, children, and co-parents — rendering it conditionally independent of everything else.',
    relatedModules: ['the-whole-orbit'],
  },
  selfEvidence: {
    term: 'Self-Evidencing',
    short: 'Living systems act to keep gathering evidence that they are alive.',
    formal: 'Agents minimise surprise by remaining near their preferred (characteristic) states.',
    relatedModules: ['the-whole-orbit'],
  },
  culturalNiche: {
    term: 'Cultural Niche',
    short: 'Shared practices and artifacts that become priors for an entire community.',
    formal: 'Priors over observations distributed across individuals; transmission is inference.',
    relatedModules: ['the-whole-orbit'],
  },
  enactivism: {
    term: 'Enactivism',
    short: 'Cognition arises from embodied, situated action — not passive representation.',
    formal:
      'Consistent with active inference in that perception-action loops are constitutive of mind.',
    relatedModules: ['the-whole-orbit'],
  },
};

/**
 * Get the full glossary, sorted alphabetically by display term.
 * @returns {Array<{key: string, entry: GlossaryEntry}>}
 */
export function getAllGlossary() {
  return Object.entries(glossary)
    .map(([key, entry]) => ({ key, entry }))
    .sort((a, b) => a.entry.term.localeCompare(b.entry.term));
}

/**
 * Look up a term by its key.
 * @param {string} key
 * @returns {GlossaryEntry|undefined}
 */
export function getGlossaryEntry(key) {
  return glossary[key];
}

/**
 * Search glossary by free text — matches term + short definition.
 * @param {string} query
 * @returns {Array<{key: string, entry: GlossaryEntry}>}
 */
export function searchGlossary(query) {
  const q = query.trim().toLowerCase();
  if (!q) return getAllGlossary();
  return getAllGlossary().filter(
    ({ entry }) =>
      entry.term.toLowerCase().includes(q) ||
      entry.short.toLowerCase().includes(q) ||
      entry.formal.toLowerCase().includes(q),
  );
}

export default glossary;
