# Spin — The Active Inference Pocket Lab

> "You are an architect of a world in formation."

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**Spin** is a mobile-first, browser-based interactive laboratory for learning [Active Inference](https://en.wikipedia.org/wiki/Free_energy_principle#Active_inference). It transforms the 10 chapters of *Active Inference: The Free Energy Principle in Mind, Brain, and Behavior* (Parr, Pezzulo & Friston, MIT Press 2022) into hands-on learning modules with three parallel experience streams.

### Genesis

This project grew from a single creative brief — [**The Seed**](doc/initial-pocket-lab-prompt.md) — which defines the constitutional narrative, the core philosophy, the Triple-Stream Architecture, and the mandate for Module 1. Every design token, animation curve, and interaction pattern in this codebase traces back to that document. It is preserved exactly as-written in `doc/initial-pocket-lab-prompt.md`. For the full documentation suite, see [**doc/**](doc/README.md).

### The Triple-Stream Architecture ("The Helix")

Each module offers three learning paths that users can switch between at any time:

| Stream | Audience | Focus |
|--------|----------|-------|
| 💓 **Pulse** | Enthusiast | Conversational language, 2-minute micro-inferences, high-school math |
| ✨ **Vision** | Artist | Interactive animations, generative art, "Variable Hearth" sliders |
| 🔬 **Core** | Academic | Clean LaTeX equations, sandbox environments, derivation steps |

### Core Philosophy

- **Aggressive Generosity**: Large touch targets, breathable typography, never worship information density
- **The Physics of the Drawer**: No teleporting — use sliders and drawers for spatial reality
- **Seasonal Rhythms**: Activity Banking, planned pauses, hibernate mode — no penalties for rest
- **The First Threshold**: Every module starts with a physical action (slider, drag, or tilt)
- **The Hearth**: Replace leaderboards with warmth, clarity badges, and "Good Questions"
- **Visible Pathing**: Proficiency maps showing exactly what's required — no hidden gates

## The 10 Modules

| # | Title | Chapter Basis |
|---|-------|---------------|
| 1 | 🌀 The First Orbit | Overview / Introduction |
| 2 | 🛤️ The Low Road | The Low Road to Active Inference |
| 3 | 🏔️ The High Road | The High Road to Active Inference |
| 4 | 🏛️ The Generative Architecture | Generative Models |
| 5 | 🧠 Message Passing | Message Passing & Neurobiology |
| 6 | 📐 A Recipe for Designing Models | A Recipe for Designing Models |
| 7 | 🎲 Discrete Worlds | Active Inference in Discrete Time |
| 8 | 🌊 Continuous Flow | Active Inference in Continuous Time |
| 9 | 📊 Model-Based Data Analysis | Model-Based Data Analysis |
| 10 | 🌐 The Whole Orbit | A Broader View |

All **10 modules** ship **Pulse**, **Vision**, and **Core** streams (`src/modules/module1` … `module10`), lazy-loaded from [`ModulePage.jsx`](src/pages/ModulePage.jsx) and marked available in [`src/data/modules.js`](src/data/modules.js).

## Quick Start

### One Command

```bash
./run.sh         # Install deps → run tests → start dev server
```

Or use individual commands:

```bash
./run.sh dev     # Start dev server only (skip tests)
./run.sh test    # Run tests only
./run.sh build   # Production build
./run.sh preview # Build + preview production
./run.sh lint    # Run linter + formatter
./run.sh clean   # Remove node_modules and dist
./run.sh help    # Show all commands
```

### Manual Setup

```bash
npm install
npm run dev      # → http://localhost:5173 (mobile viewport recommended)
npm test         # Run all 52 tests
npm run build    # Production build
```

## Project Architecture

```
public/                 # PWA: manifest.webmanifest, sw.js, icons, _redirects
src/
├── components/
│   ├── interactive/    # InferenceSlider, MathBlock, interactives, Quiz, …
│   └── layout/         # AppShell, TopBar, BottomNav, StreamSwitcher, …
├── contexts/           # AppContext, ActivityBankContext, SettingsContext
├── data/               # Module registry, glossary, badges
├── modules/
│   ├── module1/        # PulseStream, VisionStream, CoreStream (+ module2 … module10)
│   └── …
├── pages/              # Home, modules, glossary, search, settings, …
├── styles/             # Design tokens + global CSS
├── utils/              # Shared helpers (e.g. activeInference)
└── test/               # Vitest setup
```

### Key Design Decisions

- **React + Vite** for fast dev iteration and mobile-optimized builds
- **Framer Motion** for physics-based spring animations (drawer, stream switcher, rewards)
- **KaTeX** for client-side LaTeX rendering in the Core stream
- **CSS Custom Properties** design token system (no utility-class framework)
- **Context + useReducer** for state management (no external state library needed)
- **LocalStorage** persistence for Activity Banking (bookmark, sessions, streaks)

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: React Router v7
- **Animation**: Framer Motion
- **Math**: KaTeX
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + Prettier

## TODO

- [x] Triple-stream implementations for modules 1–10
- [x] PWA manifest and service worker (`public/`)
- [ ] Offline storage with IndexedDB (beyond installable shell)
- [ ] Server-synced progress (when backend is ready)
- [ ] Hearth social features (shared questions, group streaks)
- [ ] Accessibility audit (screen reader testing)
- [ ] Performance profiling for canvas animations

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT — See [LICENSE](LICENSE) for details.

## References

- Parr, T., Pezzulo, G., & Friston, K. J. (2022). *Active Inference: The Free Energy Principle in Mind, Brain, and Behavior*. MIT Press.
- [Active Inference Institute](https://www.activeinference.org/)
