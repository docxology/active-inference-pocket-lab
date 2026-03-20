# AGENTS.md — AI Agent Context

## Project: Spin — The Active Inference Pocket Lab

### Purpose
Mobile-first React web app for learning Active Inference through interactive modules
with the Triple-Stream Architecture (Pulse / Vision / Core).

### Genesis
The project originates from a single creative brief: `doc/initial-pocket-lab-prompt.md` (the "Seed"). This document defines the constitutional narrative, the 6 rules, the Triple-Stream Architecture, and the Module 1 prototype mandate. It is preserved exactly as-written and must never be modified. All design and architectural decisions should be validated against this founding document.

### Tech Stack
- React 19 + Vite 8
- React Router v7 (BrowserRouter)
- Framer Motion (physics-based animations)
- KaTeX (LaTeX rendering)
- Vitest + Testing Library (testing)
- Vanilla CSS with design tokens

### Architecture
- `src/contexts/` — Global state (AppContext for streams, ActivityBankContext for pause/bookmark)
- `src/components/interactive/` — Reusable interactive elements (InferenceSlider, MathBlock, etc.)
- `src/components/layout/` — Layout shells (AppShell, BottomNav, StreamSwitcher, Drawer)
- `src/modules/moduleN/` — Per-module stream implementations (PulseStream, VisionStream, CoreStream)
- `src/pages/` — Route-level page components
- `src/data/modules.js` — Module registry (10 modules, metadata, availability)
- `src/styles/` — Design tokens + global CSS

### Key Patterns
- Triple-Stream: Each module has 3 experiences (Pulse, Vision, Core) switchable at any time
- Activity Banking: LocalStorage-persisted pause/resume/bookmark system
- First Threshold: Every module starts with a physical action (no walls of text)
- Module expansion: Add streams in `src/modules/`, register in `ModulePage.jsx` `MODULE_STREAMS`

### Conventions
- **Thin Orchestrator**: Always use `./run.sh` as the primary entry point for dev, test, and build operations.
- JSDoc on all exported functions/components
- Console logs use `[ComponentName]` prefix
- CSS uses design tokens from `design-tokens.css` (never inline colors/sizes)
- Touch targets minimum 48×48px
- No mocks in tests — use real methods only
- **Verification**: Always extensively test changes via `npm test` and browser verification before committing.
