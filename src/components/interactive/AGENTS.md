# AGENTS.md — components/interactive/

## Purpose

Touch-optimized interactive components for Active Inference learning modules.

## Components

- `InferenceSlider.jsx` — Range slider with glow, ARIA, custom formatting
- `MathBlock.jsx` — KaTeX LaTeX with collapsible derivation steps
- `PauseButton.jsx` — Saves bookmark to ActivityBankContext, validates rest
- `RewardAnimation.jsx` — Orbiting particle celebration animation

## Dependencies

- `framer-motion` — Spring animations (slider glow, reward particles)
- `katex` — LaTeX rendering (MathBlock only)
- `ActivityBankContext` — Bookmark persistence (PauseButton)

## Conventions

- Each component has co-located `.css` file
- All interactive elements: minimum 48×48px touch targets
- ARIA attributes required on all input elements
- Console logs: `[ComponentName]` prefix
