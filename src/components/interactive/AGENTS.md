# AGENTS.md — components/interactive/

## Purpose

Touch-optimized interactive components for Active Inference learning modules.

## Components

- `InferenceSlider.jsx` — Range slider with glow, ARIA, custom formatting
- `MathBlock.jsx` — KaTeX LaTeX with collapsible derivation steps
- `Quiz.jsx` — End-of-module retrieval (uses `ActivityBankContext.recordQuiz`)
- `GlossaryLink.jsx` — Inline link to `/glossary#key`
- `GlossaryChips.jsx` — Chip row of glossary links
- `PauseButton.jsx` — Saves bookmark to ActivityBankContext, validates rest
- `RewardAnimation.jsx` — Orbiting particle celebration animation
- Additional module-specific widgets (BeliefChart, GridWorld, etc.) — see folder listing

## Dependencies

- `framer-motion` — Spring animations (slider glow, reward particles)
- `katex` — LaTeX rendering (MathBlock)
- `ActivityBankContext` — Bookmark persistence (PauseButton), quiz recording (Quiz)
- `react-router-dom` — Glossary links

## Conventions

- Each component has co-located `.css` file where needed
- All interactive elements: minimum 48×48px touch targets
- ARIA attributes required on all input elements
- Console logs: `[ComponentName]` prefix
