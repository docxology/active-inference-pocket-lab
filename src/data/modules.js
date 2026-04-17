/**
 * @file modules.js — Module Registry
 * @description Canonical source of truth for all 10 Active Inference learning
 * modules. Each module maps to a chapter of Parr, Pezzulo & Friston (2022) and
 * carries rich metadata: learning outcomes, key equations, glossary keys,
 * micro-quizzes, and Triple-Stream pedagogy.
 *
 * Every field here is consumed by the UI — keep it truthful, concise, and
 * pedagogically sharp.
 *
 * @module data/modules
 */

/**
 * @typedef {Object} StreamMeta
 * @property {string} summary - One-sentence pitch to the learner.
 * @property {string[]} beats - Ordered narrative beats shown to the user.
 * @property {string[]} [equations] - KaTeX-ready equations (Core stream).
 */

/**
 * @typedef {Object} QuizItem
 * @property {string} prompt - The question text.
 * @property {string[]} options - Answer options.
 * @property {number} correctIndex - 0-based index of the correct option.
 * @property {string} explanation - Why the correct answer is correct.
 */

/**
 * @typedef {Object} ModuleDefinition
 * @property {number} id
 * @property {string} slug
 * @property {string} title
 * @property {string} subtitle
 * @property {string} description
 * @property {string} icon
 * @property {string} color
 * @property {string} firstAction
 * @property {string[]} outcomes - Learning outcomes ("You'll be able to …").
 * @property {string[]} glossary - Keys into glossary.js that apply here.
 * @property {number} estMinutes - Approximate time to complete all three streams.
 * @property {number} difficulty - 1 (easy) to 5 (deep).
 * @property {Object} streams
 * @property {StreamMeta} streams.pulse
 * @property {StreamMeta} streams.vision
 * @property {StreamMeta} streams.core
 * @property {QuizItem[]} quiz - Three-question micro-quiz at module end.
 * @property {boolean} available - Whether all three streams are implemented.
 */

/** @type {ModuleDefinition[]} */
const modules = [
  {
    id: 1,
    slug: 'the-first-orbit',
    title: 'The First Orbit',
    subtitle: 'Chapter 1 — Overview',
    description:
      'Your brain is a prediction machine. Discover how expectations shape reality through one simple slider.',
    icon: '🌀',
    color: 'var(--color-pulse)',
    firstAction: 'Move the slider to set your first prior belief',
    outcomes: [
      'Name the three ingredients of an inference: prior, observation, surprise.',
      'Explain why living systems minimize surprise to stay alive.',
      'Read the Free Energy bound F ≥ −ln p(o) in plain English.',
    ],
    glossary: ['prior', 'observation', 'surprise', 'freeEnergy', 'generativeModel'],
    estMinutes: 12,
    difficulty: 1,
    streams: {
      pulse: {
        summary: 'Discover what a generative model is through a conversational micro-inference.',
        beats: [
          'Your brain already makes predictions before you finish this sentence.',
          'That slider value was a prior belief — your best guess about the world.',
          'The gap between prediction and reality is surprise. Minimizing it is learning.',
        ],
      },
      vision: {
        summary: 'Watch orbiting particles respond to your beliefs in real time.',
        beats: [
          'The Variable Hearth: two sliders sculpt a generative orbit.',
          'Prior strength pulls the particles outward; precision tightens the ring.',
          'Explore the space — each position is a different hypothesis about the world.',
        ],
      },
      core: {
        summary: 'Explore the surprise equation and the Free Energy bound.',
        beats: [
          'Surprise = −ln p(o). Unexpected observations carry more bits.',
          'Free energy is a tractable upper bound on surprise.',
          'Minimizing F means either updating beliefs (perception) or acting on the world.',
        ],
        equations: ['F = D_{KL}[q(s) \\| p(s|o)] + (-\\ln p(o))', '\\text{Surprise} = -\\ln p(o)'],
      },
    },
    quiz: [
      {
        prompt: 'In Active Inference, what is a "prior"?',
        options: [
          'Data collected from the environment',
          "The brain's best guess about the world before new data arrives",
          'The observation after it is confirmed',
          'A mathematical constant',
        ],
        correctIndex: 1,
        explanation:
          "A prior is the generative model's prior probability over hidden states — what you believed before observing.",
      },
      {
        prompt: 'What does minimizing free energy accomplish?',
        options: [
          'It increases certainty of the prior',
          'It ignores contradictory observations',
          'It bounds surprise from above and reconciles beliefs with observations',
          'It turns off perception',
        ],
        correctIndex: 2,
        explanation:
          'Free energy is a tractable upper bound on surprise. Minimizing it approximates Bayesian inference.',
      },
      {
        prompt: 'Surprise in this framework is best described as:',
        options: [
          'An emotional reaction',
          'The negative log probability of an observation under the model',
          'A reward signal',
          'A variance estimate',
        ],
        correctIndex: 1,
        explanation:
          'Surprise (or surprisal) is −ln p(o). Low-probability observations carry more bits.',
      },
    ],
    available: true,
  },
  {
    id: 2,
    slug: 'the-low-road',
    title: 'The Low Road',
    subtitle: 'Chapter 2 — The Low Road to Active Inference',
    description:
      'Start from the ground up: prediction errors, Bayesian updating, and the mechanics of belief.',
    icon: '🛤️',
    color: 'var(--color-vision)',
    firstAction: 'Drag to create a prediction error',
    outcomes: [
      "State Bayes' theorem and identify its four pieces.",
      'Compute a posterior from a Gaussian prior and a Gaussian likelihood.',
      'Explain precision-weighted prediction errors.',
    ],
    glossary: ['bayes', 'posterior', 'likelihood', 'precision', 'predictiveCoding'],
    estMinutes: 14,
    difficulty: 2,
    streams: {
      pulse: {
        summary: 'Feel how your brain constantly generates and corrects predictions.',
        beats: [
          'Prediction is cheap; checking is the real work.',
          'Every mismatch is a small invitation to update.',
          "You're never reading reality — you're re-writing your model of it.",
        ],
      },
      vision: {
        summary: 'Visualize prediction errors as precision-weighted waves between two Gaussians.',
        beats: [
          'Slide the prior mean and the observation — watch the posterior slide.',
          'Crank up precision — the posterior tightens toward the most certain source.',
          'The distance between the two is the prediction error.',
        ],
      },
      core: {
        summary: "Derive Bayes' theorem and precision-weighted predictive coding.",
        beats: [
          'Posterior ∝ prior × likelihood — proportions, not identities.',
          'Under Gaussian assumptions, the posterior mean is a precision-weighted average.',
          'Predictive coding is the local message-passing of these updates.',
        ],
        equations: [
          'p(s|o) = \\frac{p(o|s)p(s)}{p(o)}',
          '\\mu_{post} = \\frac{\\pi_o\\, o + \\pi_p\\, \\mu_p}{\\pi_o + \\pi_p}',
          '\\pi_{post} = \\pi_o + \\pi_p',
        ],
      },
    },
    quiz: [
      {
        prompt:
          'Given a Gaussian prior (μ=0, π=1) and likelihood (o=6, π=2), the posterior mean is:',
        options: ['2', '3', '4', '6'],
        correctIndex: 2,
        explanation: '(2·6 + 1·0) / (2+1) = 12/3 = 4. Precision-weighted average.',
      },
      {
        prompt: 'Precision is:',
        options: [
          'The mean of a distribution',
          'The inverse of variance — how confident you are',
          'The error between two means',
          'The likelihood of a sample',
        ],
        correctIndex: 1,
        explanation: 'Precision π = 1/σ². Higher precision = tighter, more confident belief.',
      },
      {
        prompt: 'Prediction errors in predictive coding are:',
        options: [
          'Amplified by low precision',
          'Weighted by the precision of the expected signal',
          'Ignored when precision is high',
          'Independent of uncertainty',
        ],
        correctIndex: 1,
        explanation: 'Precision-weighted prediction errors are the currency of cortical updates.',
      },
    ],
    available: true,
  },
  {
    id: 3,
    slug: 'the-high-road',
    title: 'The High Road',
    subtitle: 'Chapter 3 — The High Road to Active Inference',
    description:
      'Zoom out to the big picture: variational inference, free energy, and surprise minimization.',
    icon: '🏔️',
    color: 'var(--color-core)',
    firstAction: 'Tilt the landscape to find the basin of attraction',
    outcomes: [
      'Describe free energy as an upper bound on surprise.',
      'Identify the Energy and Entropy terms of the free energy functional.',
      'Explain why action and perception both minimize free energy.',
    ],
    glossary: ['variationalInference', 'freeEnergy', 'kl', 'entropy', 'attractor'],
    estMinutes: 14,
    difficulty: 3,
    streams: {
      pulse: {
        summary: 'Understand why living things must minimize surprise to survive.',
        beats: [
          'A fish out of water is, literally, surprised — its expected states are violated.',
          'Staying alive means keeping your observations within the bounds of "you".',
          'Action and perception are two ways to shrink the same gap.',
        ],
      },
      vision: {
        summary: 'Navigate a free energy landscape; find the basin of attraction.',
        beats: [
          'Each position on the landscape is a belief configuration.',
          'Low valleys are low-free-energy states — where your model fits.',
          'Tilt the world: the ball rolls toward the nearest attractor.',
        ],
      },
      core: {
        summary: 'Derive the variational free energy from first principles.',
        beats: [
          'Start with the log-evidence and introduce a recognition density q(s).',
          "Apply Jensen's inequality to obtain F ≥ −ln p(o).",
          'F decomposes as Energy − Entropy, or Complexity − Accuracy.',
        ],
        equations: [
          'F = \\mathbb{E}_q[-\\ln p(o,s)] - \\mathbb{E}_q[-\\ln q(s)]',
          'F = \\underbrace{D_{KL}[q(s) \\| p(s)]}_{Complexity} - \\underbrace{\\mathbb{E}_q[\\ln p(o|s)]}_{Accuracy}',
        ],
      },
    },
    quiz: [
      {
        prompt: 'Free energy equals surprise when:',
        options: [
          'Observations are absent',
          'The approximate posterior q(s) equals the true posterior p(s|o)',
          'Entropy is zero',
          'Precision is infinite',
        ],
        correctIndex: 1,
        explanation: 'The KL gap closes when q = p(s|o). F then equals the negative log evidence.',
      },
      {
        prompt: 'Accuracy in the free energy decomposition is:',
        options: [
          'Entropy of the prior',
          'Expected log-likelihood under the recognition density',
          'Negative KL divergence',
          'The marginal likelihood',
        ],
        correctIndex: 1,
        explanation: 'Accuracy = E_q[ln p(o|s)] — how well the model explains observations.',
      },
      {
        prompt: 'Action minimizes free energy by:',
        options: [
          'Changing beliefs to fit observations',
          'Changing observations to fit expected states',
          'Randomizing the prior',
          'Lowering precision',
        ],
        correctIndex: 1,
        explanation:
          'Action selects observations consistent with preferred priors. Perception updates beliefs given observations.',
      },
    ],
    available: true,
  },
  {
    id: 4,
    slug: 'the-generative-architecture',
    title: 'The Generative Architecture',
    subtitle: 'Chapter 4 — Generative Models',
    description: 'Build and dissect the structures that make prediction possible.',
    icon: '🏛️',
    color: 'var(--color-accent)',
    firstAction: 'Connect nodes to build your first generative model',
    outcomes: [
      'Describe a generative model as p(o, s) — joint over observations and hidden states.',
      'Distinguish hierarchical from flat architectures.',
      'Assemble priors, likelihoods, and transitions into a working model.',
    ],
    glossary: ['generativeModel', 'hierarchical', 'likelihood', 'prior', 'transition'],
    estMinutes: 16,
    difficulty: 3,
    streams: {
      pulse: {
        summary: 'Think of generative models like recipes for generating worlds.',
        beats: [
          'A generative model is a recipe: given latent ingredients, produce observations.',
          'Hierarchy lets fast features (edges) feed slow ones (objects, stories).',
          'You already run thousands of these simultaneously, all the time.',
        ],
      },
      vision: {
        summary: 'Build visual model architectures by connecting modules.',
        beats: [
          'Drop hidden-state nodes, wire up likelihood edges, add priors.',
          'Watch a sampled observation emerge from the joint.',
          'Rearrange the structure — a new world snaps into being.',
        ],
      },
      core: {
        summary: 'Explore hierarchical models, precision weighting, and likelihood.',
        beats: [
          'A joint model: p(o, s) = p(o|s) · p(s).',
          'Hierarchies factorize: p(s¹, s², … sᴸ) = ∏ p(sˡ | sˡ⁺¹).',
          'Conditional conjugacy makes inference tractable.',
        ],
        equations: [
          'p(o, s) = p(o|s)\\, p(s)',
          'p(s^1 \\dots s^L) = \\prod_{\\ell} p(s^\\ell | s^{\\ell+1})',
        ],
      },
    },
    quiz: [
      {
        prompt: 'A generative model decomposes p(o, s) into:',
        options: ['o × s', 'p(o) + p(s)', 'p(o|s) · p(s)', 'p(s|o) · p(o)'],
        correctIndex: 2,
        explanation: 'Joint = likelihood × prior.',
      },
      {
        prompt: 'Hierarchical generative models exist to:',
        options: [
          'Increase parameter counts',
          'Factorize beliefs across timescales and abstractions',
          'Replace priors with likelihoods',
          'Eliminate precision weighting',
        ],
        correctIndex: 1,
        explanation:
          'Higher layers capture slower, more abstract regularities that constrain lower layers.',
      },
      {
        prompt: 'Precision in a hierarchical model controls:',
        options: [
          'The order of message passing',
          'The relative weight of top-down vs bottom-up signals',
          'The number of layers',
          'The sampling rate',
        ],
        correctIndex: 1,
        explanation: 'Higher precision on a signal increases its influence on downstream updates.',
      },
    ],
    available: true,
  },
  {
    id: 5,
    slug: 'message-passing',
    title: 'Message Passing',
    subtitle: 'Chapter 5 — Message Passing and Neurobiology',
    description: 'See how the brain implements inference through neural message passing.',
    icon: '🧠',
    color: 'var(--color-pulse)',
    firstAction: 'Tap neurons to send prediction signals',
    outcomes: [
      'Describe belief propagation on a factor graph.',
      'Map predictive coding messages onto cortical micro-circuits.',
      'Identify prediction and error units in a simple circuit.',
    ],
    glossary: ['messagePassing', 'beliefPropagation', 'predictiveCoding', 'precision'],
    estMinutes: 16,
    difficulty: 3,
    streams: {
      pulse: {
        summary: 'Your neurons are constantly chatting — learn their language.',
        beats: [
          'Pyramidal cells gossip predictions down, prediction errors up.',
          'Precision is the volume knob on each conversation.',
          'When the whisper matches expectation, silence is the signal.',
        ],
      },
      vision: {
        summary: 'Watch messages flow through a three-layer neural network in real time.',
        beats: [
          'Top-down expectations descend in blue; bottom-up errors ascend in red.',
          'Tap a layer to perturb it — feel the wave propagate.',
          'Precision sliders change who wins the conversation.',
        ],
      },
      core: {
        summary: 'Implement belief propagation and marginal message passing.',
        beats: [
          'Messages are the residuals between expected and observed messages.',
          'Variational message passing updates parameters of each factor.',
          'Marginal message passing is a tractable approximation for loopy graphs.',
        ],
        equations: [
          'm_{i \\to j}(s_j) \\propto \\sum_{s_i} \\psi_{ij}(s_i, s_j) \\prod_{k \\neq j} m_{k \\to i}(s_i)',
          '\\varepsilon^{(\\ell)} = \\pi^{(\\ell)}(o^{(\\ell)} - g(\\mu^{(\\ell+1)}))',
        ],
      },
    },
    quiz: [
      {
        prompt: 'In predictive coding, pyramidal prediction errors ascend primarily via:',
        options: ['Granular layer 4', 'Superficial layers 2/3', 'Deep layer 6', 'Subcortex'],
        correctIndex: 1,
        explanation:
          'Superficial pyramidal cells broadcast precision-weighted prediction errors up the hierarchy.',
      },
      {
        prompt: 'Belief propagation is exact on:',
        options: ['Any graph', 'Trees (acyclic factor graphs)', 'Complete graphs', 'Random graphs'],
        correctIndex: 1,
        explanation: 'On trees, BP converges to true marginals; on loopy graphs it is approximate.',
      },
      {
        prompt: 'Attention in this framework corresponds to:',
        options: [
          'Raising a threshold',
          'Boosting precision on specific messages',
          'Silencing priors',
          'Sampling more observations',
        ],
        correctIndex: 1,
        explanation: 'Attention ≈ precision-weighting: gain control on prediction errors.',
      },
    ],
    available: true,
  },
  {
    id: 6,
    slug: 'designing-models',
    title: 'A Recipe for Designing Models',
    subtitle: 'Chapter 6 — A Recipe for Designing Models',
    description: 'Learn the practical craft of building models for real-world inference.',
    icon: '📐',
    color: 'var(--color-vision)',
    firstAction: 'Drag ingredients into the model recipe',
    outcomes: [
      'List the six ingredients of a discrete-state generative model (A, B, C, D, E, π).',
      'Specify each matrix for a toy foraging problem.',
      'Debug a mis-specified model by inspecting each ingredient.',
    ],
    glossary: ['matrixA', 'matrixB', 'matrixC', 'matrixD', 'policy', 'expectedFreeEnergy'],
    estMinutes: 16,
    difficulty: 4,
    streams: {
      pulse: {
        summary: 'Model building is like cooking — follow the recipe, then improvise.',
        beats: [
          'A is the likelihood — how hidden states look.',
          'B is transition — how the world moves.',
          'C is preference — what you want. D is the prior over initial states.',
        ],
      },
      vision: {
        summary: 'Drag-and-drop model components into a working architecture.',
        beats: [
          'Pick each matrix and watch the agent behavior change.',
          'Swap a uniform A for a narrow one — perception sharpens.',
          'Set C to favor a reward state — action emerges.',
        ],
      },
      core: {
        summary: 'Specify likelihoods, priors, and transition matrices from scratch.',
        beats: [
          'Discrete POMDPs: A[o,s], B[s′, s, u], C[o], D[s], E[π].',
          'Policies π are sequences of control states u₁ … u_T.',
          'Expected Free Energy ranks policies by exploration + exploitation.',
        ],
        equations: [
          "A_{o,s} = p(o|s),\\ B_{s,s',u} = p(s|s',u)",
          'G(\\pi) = \\mathbb{E}_{q}[ \\ln q(s|\\pi) - \\ln p(o,s|\\pi)]',
        ],
      },
    },
    quiz: [
      {
        prompt: 'In the A-B-C-D recipe, which matrix encodes goal preferences?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 2,
        explanation:
          'C encodes prior preferences over observations — the agent wants what C rewards.',
      },
      {
        prompt: 'Expected free energy ranks policies by:',
        options: [
          'Only expected rewards',
          'Epistemic value + pragmatic value',
          'Random sampling',
          'Minimum description length',
        ],
        correctIndex: 1,
        explanation: 'EFE balances information gain (epistemic) against goal-seeking (pragmatic).',
      },
      {
        prompt: 'If transition matrix B is the identity, the world is:',
        options: ['Chaotic', 'Stationary — no state change', 'Periodic', 'Non-Markovian'],
        correctIndex: 1,
        explanation: 'Identity B means each state transitions to itself.',
      },
    ],
    available: true,
  },
  {
    id: 7,
    slug: 'discrete-worlds',
    title: 'Discrete Worlds',
    subtitle: 'Chapter 7 — Active Inference in Discrete Time',
    description: 'Step through discrete time: policies, expected free energy, and planning.',
    icon: '🎲',
    color: 'var(--color-core)',
    firstAction: 'Move your agent through a grid world',
    outcomes: [
      'Simulate an agent in a 3×3 grid that minimizes expected free energy.',
      'Decompose EFE into ambiguity + risk.',
      'Explain why curiosity falls out of the math for free.',
    ],
    glossary: ['pomdp', 'expectedFreeEnergy', 'policy', 'ambiguity', 'risk'],
    estMinutes: 18,
    difficulty: 4,
    streams: {
      pulse: {
        summary: 'Decisions are like choosing paths — each step reveals new information.',
        beats: [
          'Your agent plans by imagining futures and grading them.',
          'Paths with lots of new info (epistemic) or reward (pragmatic) win.',
          'Curiosity is not a separate add-on — it drops out of the math.',
        ],
      },
      vision: {
        summary: 'Guide an agent through a grid world using active inference.',
        beats: [
          'Place a goal, pin a lantern of preference — watch the agent walk there.',
          'Cover tiles in fog — the agent will detour to peek.',
          'Adjust risk vs ambiguity sliders to see personality shift.',
        ],
      },
      core: {
        summary: 'Implement POMDP-based planning with expected free energy.',
        beats: [
          'Enumerate short-horizon policies; score by G(π).',
          'Softmax policy selection: q(π) ∝ exp(−γ·G(π)).',
          'The precision γ interpolates deterministic ↔ exploratory behavior.',
        ],
        equations: [
          'G(\\pi) = \\underbrace{\\mathbb{E}_{q}[H[p(o|s)]]}_{ambiguity} + \\underbrace{D_{KL}[q(o|\\pi)\\|p(o)]}_{risk}',
          'q(\\pi) = \\sigma(-\\gamma\\, G(\\pi))',
        ],
      },
    },
    quiz: [
      {
        prompt: 'Expected free energy decomposes into:',
        options: [
          'Energy − Entropy',
          'Ambiguity + Risk',
          'Accuracy − Complexity',
          'Prior + Posterior',
        ],
        correctIndex: 1,
        explanation: 'G = ambiguity (expected entropy of likelihood) + risk (KL to preferences).',
      },
      {
        prompt: 'Higher policy precision γ makes behavior more:',
        options: ['Random', 'Goal-directed and deterministic', 'Exploratory', 'Non-stationary'],
        correctIndex: 1,
        explanation: 'Large γ sharpens the softmax — the highest-scoring policy dominates.',
      },
      {
        prompt: 'Epistemic value is high when:',
        options: [
          'The agent already knows everything',
          'An action resolves uncertainty about hidden states',
          'The environment is deterministic',
          'There is no reward',
        ],
        correctIndex: 1,
        explanation: 'Epistemic value = expected information gain about hidden states.',
      },
    ],
    available: true,
  },
  {
    id: 8,
    slug: 'continuous-flow',
    title: 'Continuous Flow',
    subtitle: 'Chapter 8 — Active Inference in Continuous Time',
    description: 'Flow through continuous dynamics: generalized coordinates and smooth inference.',
    icon: '🌊',
    color: 'var(--color-accent)',
    firstAction: 'Slide to control the flow of continuous dynamics',
    outcomes: [
      'Interpret generalized coordinates of motion (x, x′, x″, …).',
      'Write a predictive coding update as a gradient flow.',
      'Describe motor action as suppression of proprioceptive prediction errors.',
    ],
    glossary: ['generalizedCoordinates', 'langevin', 'gradientFlow', 'proprioception'],
    estMinutes: 18,
    difficulty: 5,
    streams: {
      pulse: {
        summary: "Life doesn't happen in steps — learn inference that flows continuously.",
        beats: [
          'Everything you do is a smooth descent toward a predicted future.',
          'Your arm moves because the prediction error says it is already moving.',
          'Dynamics, not decisions, are the primary thing.',
        ],
      },
      vision: {
        summary: 'Watch smooth trajectories emerge from continuous active inference.',
        beats: [
          'A particle descends a free energy field — its path is its belief.',
          'Perturb the field; the particle replans in real time.',
          'Increase temperature to add noise — explore vs exploit, continuously.',
        ],
      },
      core: {
        summary: 'Explore generalized coordinates of motion and Langevin dynamics.',
        beats: [
          'States are stacks: x̃ = (x, x′, x″, …).',
          'Gradient descent on F yields the belief flow ẋ = −∂F/∂x + D x̃.',
          'Action = descent on F with respect to controls (proprioceptive).',
        ],
        equations: [
          '\\tilde{x} = (x, x\\prime, x\\prime\\prime, \\ldots)',
          '\\dot{\\tilde{x}} = \\mathcal{D}\\tilde{x} - \\partial_{\\tilde{x}} F',
        ],
      },
    },
    quiz: [
      {
        prompt: 'Generalized coordinates of motion represent:',
        options: [
          'Spatial axes only',
          'A state and its temporal derivatives',
          'Policies',
          'Discrete time steps',
        ],
        correctIndex: 1,
        explanation: '(x, x′, x″, …) captures motion locally as a Taylor expansion.',
      },
      {
        prompt: 'In continuous active inference, action is:',
        options: [
          'A high-level plan',
          'Suppression of proprioceptive prediction errors via the reflex arc',
          'A separate reward system',
          'A stochastic gradient',
        ],
        correctIndex: 1,
        explanation: 'Motor commands are predictions the body fulfills by moving.',
      },
      {
        prompt: 'The Langevin-like term in belief dynamics:',
        options: [
          'Adds nothing',
          'Injects noise making inference stochastic',
          'Removes priors',
          'Forces determinism',
        ],
        correctIndex: 1,
        explanation: 'Stochastic dynamics implement sampling from the posterior.',
      },
    ],
    available: true,
  },
  {
    id: 9,
    slug: 'model-based-analysis',
    title: 'Model-Based Data Analysis',
    subtitle: 'Chapter 9 — Model-Based Data Analysis',
    description: 'Fit models to real data: parameter estimation and model comparison.',
    icon: '📊',
    color: 'var(--color-pulse)',
    firstAction: 'Upload or generate data to fit your first model',
    outcomes: [
      'Distinguish parameter estimation from model comparison.',
      'Read a Bayes factor and a log model evidence.',
      'Fit a toy DCM-style model to simulated data.',
    ],
    glossary: ['modelEvidence', 'bayesFactor', 'variationalLaplace', 'bms'],
    estMinutes: 18,
    difficulty: 4,
    streams: {
      pulse: {
        summary: 'Data tells stories — learn to listen through model fitting.',
        beats: [
          'Fitting is a conversation: data speaks, model answers, both change.',
          'The model that survives the most data — with the fewest assumptions — wins.',
          'Occam is baked into the math; you never have to bolt it on.',
        ],
      },
      vision: {
        summary: 'Watch your model adapt to data in a real-time fitting sandbox.',
        beats: [
          'Scatter some points; slide the Gaussian model until it fits.',
          'Read the log evidence climb as fit improves.',
          'Compare two models side by side — Bayes factor appears.',
        ],
      },
      core: {
        summary: 'Implement variational Laplace and Bayesian model comparison.',
        beats: [
          'Variational Laplace approximates posteriors as multivariate Gaussians.',
          'Log model evidence = accuracy − complexity.',
          'Bayes factor B_12 = p(o|m₁) / p(o|m₂). >10 is strong support.',
        ],
        equations: [
          '\\ln p(o|m) \\approx \\text{accuracy} - \\text{complexity}',
          'B_{12} = \\frac{p(o|m_1)}{p(o|m_2)}',
        ],
      },
    },
    quiz: [
      {
        prompt: 'A Bayes factor B12 = 20 means:',
        options: [
          'Weak evidence for m2',
          'Strong evidence for m1 over m2',
          'Evidence for m2 over m1',
          'No evidence',
        ],
        correctIndex: 1,
        explanation: 'B12 > 10 is typically described as strong evidence in favour of m1.',
      },
      {
        prompt: 'Log model evidence decomposes as:',
        options: [
          'Complexity + Accuracy',
          'Accuracy − Complexity',
          '− Accuracy + Complexity',
          'Only Accuracy',
        ],
        correctIndex: 1,
        explanation: 'Evidence rewards fit and penalises complexity — Occam for free.',
      },
      {
        prompt: 'Variational Laplace assumes posteriors are:',
        options: ['Uniform', 'Multivariate Gaussian', 'Discrete', 'Dirac deltas'],
        correctIndex: 1,
        explanation: 'It uses a Gaussian approximation around the mode.',
      },
    ],
    available: true,
  },
  {
    id: 10,
    slug: 'the-whole-orbit',
    title: 'The Whole Orbit',
    subtitle: 'Chapter 10 — A Broader View',
    description: 'See the full picture: from neurons to culture, from physics to philosophy.',
    icon: '🌐',
    color: 'var(--color-vision)',
    firstAction: 'Expand the concept map to see all connections',
    outcomes: [
      'Trace the golden thread from surprise to culture.',
      'Map Active Inference onto neighbouring frameworks (RL, Bayesian brain).',
      'Articulate one open question that matters to you.',
    ],
    glossary: ['markovBlanket', 'selfEvidence', 'culturalNiche', 'enactivism'],
    estMinutes: 20,
    difficulty: 5,
    streams: {
      pulse: {
        summary: "Active inference isn't just a theory — it's a way of being in the world.",
        beats: [
          'Every cell, every organism, every culture is a self-evidencing loop.',
          'Markov blankets keep you, you — and let you talk to the outside.',
          'The most useful model is the one you live inside.',
        ],
      },
      vision: {
        summary: 'Explore an interactive concept map connecting all 9 previous modules.',
        beats: [
          'Each node is a concept; each edge is a derivation or analogy.',
          'Drag a node; see which ideas sympathetically light up.',
          'Save your own annotations to the Hearth.',
        ],
      },
      core: {
        summary: 'Review the mathematical unification of perception, action, and learning.',
        beats: [
          'One functional — free energy — explains inference, control, and learning.',
          'Timescales nest: fast inference, slower learning, slowest evolution.',
          'Open problems: scaling, continuous-discrete bridging, social inference.',
        ],
        equations: [
          'F = \\text{Complexity} - \\text{Accuracy}',
          'G(\\pi) = \\text{Ambiguity} + \\text{Risk}',
        ],
      },
    },
    quiz: [
      {
        prompt: 'A Markov blanket is:',
        options: [
          'A type of prior',
          'Statistical boundary separating a system from its environment',
          'A neural layer',
          'A sampling method',
        ],
        correctIndex: 1,
        explanation:
          'A Markov blanket is the set of variables that render a system conditionally independent of the outside.',
      },
      {
        prompt: 'Self-evidencing means:',
        options: [
          'Ignoring observations',
          'Actively gathering data that confirms the model of "me"',
          'Proving a theorem',
          'Replicating RNA',
        ],
        correctIndex: 1,
        explanation: 'Organisms act to remain the kind of thing they expect themselves to be.',
      },
      {
        prompt: 'Active inference subsumes reinforcement learning because:',
        options: [
          'RL subsumes AI',
          'Rewards can be expressed as priors over observations (C)',
          'RL avoids priors',
          'AI ignores policies',
        ],
        correctIndex: 1,
        explanation:
          'With C encoding preferred observations, EFE minimization reduces to reward-seeking in the appropriate limit.',
      },
    ],
    available: true,
  },
];

/**
 * @returns {ModuleDefinition[]}
 */
export function getAllModules() {
  return modules;
}

/**
 * @param {number|string} id
 * @returns {ModuleDefinition|undefined}
 */
export function getModuleById(id) {
  return modules.find((m) => m.id === Number(id));
}

/**
 * @param {string} slug
 * @returns {ModuleDefinition|undefined}
 */
export function getModuleBySlug(slug) {
  return modules.find((m) => m.slug === slug);
}

/**
 * @returns {ModuleDefinition[]}
 */
export function getAvailableModules() {
  return modules.filter((m) => m.available);
}

/**
 * Count of modules currently implemented.
 * @returns {number}
 */
export function getAvailableCount() {
  return modules.filter((m) => m.available).length;
}

export { modules };
export default modules;
