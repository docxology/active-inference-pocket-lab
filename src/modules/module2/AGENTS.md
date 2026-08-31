# AGENTS — active-inference-pocket-lab/src/modules/module2

Status: REAL (doc fleet, 2026-08-30)

Interactive module module2 of the Active Inference Pocket Lab React app: "The Low Road — Bayes' theorem and precision-weighted predictive coding".

## Layout
- `CoreStream.jsx` — core experience component (the main interactive lesson).
- `PulseStream.jsx` — pulse experience (embodied/affective variant).
- `VisionStream.jsx` — vision experience (visual/animated variant).
- `VisionStream.css` — styles for VisionStream (module27 and module28 only).
- `index.js` — barrel: re-exports PulseStream / CoreStream / VisionStream.

## Invariants
- Component headers carry `@file`/`@description` JSDoc naming the module theme; keep them in sync when retitling.
- Modules are self-contained: import shared state/utilities from the app root, not from sibling modules.
