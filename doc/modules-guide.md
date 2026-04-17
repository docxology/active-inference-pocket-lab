# Modules Guide

How to understand, build, and expand Spin's 10 Active Inference modules.

## The Triple-Stream Architecture

Each module offers three parallel learning paths ("The Helix"):

| Stream | Persona | Content Style | Math Level | Primary Interaction |
| --- | --- | --- | --- | --- |
| 💓 Pulse | The Enthusiast | Conversational, warm, 2-minute | High-school | Slider-first micro-inference |
| ✨ Vision | The Artist | Generative art, visual | Minimal | Canvas/SVG animation |
| 🔬 Core | The Academic | Clean LaTeX, derivations | University | Sandbox environment |

Users can switch streams at any time via the StreamSwitcher. Progress is tracked per-stream.

## The 10 Modules

Each module has a `src/modules/moduleN/` package (Pulse, Vision, Core) registered in `ModulePage.jsx` and marked `available: true` in `modules.js`.

### Module 1: 🌀 The First Orbit ✅
**Chapter**: Overview / Introduction
**First Action**: Move the Prior Belief slider
**Content**:
- **Pulse**: 3-step micro-inference (prediction → observation → surprise)
- **Vision**: Orbiting particle canvas responding to Prior Strength and Precision
- **Core**: Variational Free Energy derivation with live sandbox

### Module 2: 🛤️ The Low Road ✅
**Chapter**: The Low Road to Active Inference
**First Action**: Drag a ball toward an attractor
**Content**: Reflexes, habits, homeostasis → Active Inference from the bottom up

### Module 3: 🏔️ The High Road ✅
**Chapter**: The High Road to Active Inference
**First Action**: Adjust a Bayesian prior distribution
**Content**: Bayesian brain, predictive processing → Active Inference from the top down

### Module 4: 🏛️ The Generative Architecture ✅
**Chapter**: Generative Models
**First Action**: Rewire a simple graphical model
**Content**: Structure of generative models, likelihood, prior, posterior

### Module 5: 🧠 Message Passing ✅
**Chapter**: Message Passing & Neurobiology
**First Action**: Send a prediction error signal
**Content**: Belief propagation, neural correlates, forward/backward messages

### Module 6: 📐 A Recipe for Designing Models ✅
**Chapter**: A Recipe for Designing Models
**First Action**: Select variables for a model
**Content**: Practical modeling, choosing states, observations, parameters

### Module 7: 🎲 Discrete Worlds ✅
**Chapter**: Active Inference in Discrete Time
**First Action**: Choose an action in a grid world
**Content**: POMDPs, policy selection, expected free energy

### Module 8: 🌊 Continuous Flow ✅
**Chapter**: Active Inference in Continuous Time
**First Action**: Perturb a dynamical system
**Content**: Continuous-time models, generalized coordinates, action

### Module 9: 📊 Model-Based Data Analysis ✅
**Chapter**: Model-Based Data Analysis
**First Action**: Fit a model to data points
**Content**: Parameter estimation, model comparison, Bayesian inference

### Module 10: 🌐 The Whole Orbit ✅
**Chapter**: A Broader View
**First Action**: Place Active Inference among paradigms
**Content**: Philosophical implications, future directions, capstone

## Creating a New Module

### Step 1: Create the directory
```bash
mkdir -p src/modules/moduleN
```

### Step 2: Implement streams
Create three JSX files + CSS:
- `PulseStream.jsx` + `PulseStream.css`
- `VisionStream.jsx` + `VisionStream.css`
- `CoreStream.jsx` + `CoreStream.css`

### Step 3: Create barrel export
```js
// src/modules/moduleN/index.js
export { default as PulseStream } from './PulseStream';
export { default as VisionStream } from './VisionStream';
export { default as CoreStream } from './CoreStream';
```

### Step 4: Register streams
In `src/pages/ModulePage.jsx`:
```js
import { PulseStream, VisionStream, CoreStream } from '../modules/moduleN';

const MODULE_STREAMS = {
  // ... existing modules
  N: {
    [STREAMS.PULSE]: PulseStream,
    [STREAMS.VISION]: VisionStream,
    [STREAMS.CORE]: CoreStream,
  },
};
```

### Step 5: Enable the module
In `src/data/modules.js`, set `available: true` for the module entry.

### Step 6: Add documentation
Create `README.md` and `AGENTS.md` in `src/modules/moduleN/`.

### Step 7: Write tests
Add `ModuleNPulse.test.jsx` (at minimum) in `src/__tests__/modules/`.

## Stream Content Requirements

### The First Threshold
Every module **must** start with a physical action — not text. Examples:
- Move a slider
- Drag an element
- Tap to select
- Tilt the device

### Pulse Requirements
- Maximum 3 screens of content
- Each screen has at most 2-3 sentences
- One interactive element per screen
- Language: conversational, warm, no jargon without context
- Math: ≤ high-school algebra

### Vision Requirements
- Real-time animation responding to ≥ 1 slider
- Canvas or SVG-based (no static images)
- Visual metaphor for the module's core concept
- Exploration threshold triggers "Spin" reward

### Core Requirements
- LaTeX equations via `MathBlock` component
- Derivation steps (collapsible)
- Live sandbox in `Drawer` with computed metrics
- All equations numbered and labeled
