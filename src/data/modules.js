/**
 * @file modules.js — Module Registry
 * @description Defines all 10 learning modules mapped to the Active Inference textbook.
 *
 * Each module includes metadata for the Triple-Stream Architecture:
 * - Pulse: Conversational, high-emotion, micro-inference path
 * - Vision: Interactive animation and generative art
 * - Core: Academic, LaTeX equations, sandbox
 *
 * @module data/modules
 */

/**
 * @typedef {Object} ModuleDefinition
 * @property {number} id - Module number (1-10)
 * @property {string} slug - URL-safe identifier
 * @property {string} title - Display title
 * @property {string} subtitle - Chapter reference
 * @property {string} description - Brief description
 * @property {string} icon - Emoji icon for the module
 * @property {string} color - CSS color variable
 * @property {Object} streams - Stream-specific descriptions
 * @property {string} firstAction - The physical action that starts this module
 * @property {boolean} available - Whether the module is implemented
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
    streams: {
      pulse: 'Discover what a generative model is through a conversational micro-inference.',
      vision: 'Watch orbiting particles respond to your beliefs in real-time.',
      core: 'Explore the surprise equation: -log p(o) and the Free Energy bound.',
    },
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
    streams: {
      pulse: 'Feel how your brain constantly generates and corrects predictions.',
      vision: 'Visualize prediction errors as waves propagating through layers.',
      core: "Derive Bayes' theorem and predictive coding step by step.",
    },
    available: false,
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
    firstAction: 'Tilt to navigate the free energy landscape',
    streams: {
      pulse: 'Understand why living things must minimize surprise to survive.',
      vision: 'Navigate a 3D free energy landscape — find the basin of attraction.',
      core: 'Derive the variational free energy from first principles.',
    },
    available: false,
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
    streams: {
      pulse: 'Think of generative models like recipes for generating worlds.',
      vision: 'Build visual model architectures by connecting modules.',
      core: 'Explore hierarchical models, precision weighting, and likelihood.',
    },
    available: false,
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
    streams: {
      pulse: 'Your neurons are constantly chatting — learn their language.',
      vision: 'Watch messages flow through a neural network in real-time.',
      core: 'Implement belief propagation and marginal message passing.',
    },
    available: false,
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
    streams: {
      pulse: 'Model building is like cooking — follow the recipe, then improvise.',
      vision: 'Drag-and-drop model components into a working architecture.',
      core: 'Specify likelihoods, priors, and transition matrices from scratch.',
    },
    available: false,
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
    streams: {
      pulse: 'Decisions are like choosing paths — each step reveals new information.',
      vision: 'Guide an agent through a grid world using active inference.',
      core: 'Implement POMDP-based planning with expected free energy.',
    },
    available: false,
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
    streams: {
      pulse: "Life doesn't happen in steps — learn inference that flows continuously.",
      vision: 'Watch smooth trajectories emerge from continuous active inference.',
      core: 'Explore generalized coordinates of motion and Langevin dynamics.',
    },
    available: false,
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
    streams: {
      pulse: 'Data tells stories — learn to listen through model fitting.',
      vision: 'Watch your model adapt to data in a real-time fitting sandbox.',
      core: 'Implement variational Laplace and Bayesian model comparison.',
    },
    available: false,
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
    streams: {
      pulse: "Active inference isn't just a theory — it's a way of being in the world.",
      vision: 'Explore an interactive concept map connecting all 9 previous modules.',
      core: 'Review the mathematical unification of perception, action, and learning.',
    },
    available: false,
  },
];

/**
 * Get all modules.
 * @returns {ModuleDefinition[]}
 */
export function getAllModules() {
  return modules;
}

/**
 * Get a module by its ID.
 * @param {number} id - Module ID (1-10)
 * @returns {ModuleDefinition|undefined}
 */
export function getModuleById(id) {
  return modules.find((m) => m.id === Number(id));
}

/**
 * Get a module by its URL slug.
 * @param {string} slug - URL-safe slug
 * @returns {ModuleDefinition|undefined}
 */
export function getModuleBySlug(slug) {
  return modules.find((m) => m.slug === slug);
}

/**
 * Get available (implemented) modules.
 * @returns {ModuleDefinition[]}
 */
export function getAvailableModules() {
  return modules.filter((m) => m.available);
}

export default modules;
