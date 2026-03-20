# AGENTS.md — modules/module1/

## Purpose
Module 1 "The First Orbit" — Overview of Active Inference via three stream experiences.

## Streams
- `PulseStream.jsx` — 3-step micro-inference (slider → prediction → surprise)
- `VisionStream.jsx` — Canvas orbiting particles, 2 sliders (prior, precision)
- `CoreStream.jsx` — Variational Free Energy derivation, LaTeX, sandbox drawer

## Dependencies
- `InferenceSlider` from `components/interactive/`
- `RewardAnimation` from `components/interactive/`
- `MathBlock` from `components/interactive/`
- `Drawer` from `components/layout/`
- `AppContext` for `updateProgress`
- `framer-motion` for transitions

## Key Functions
- `computeMetrics(observation, prior, precision)` — CoreStream utility, returns surprise/KL/freeEnergy
- `drawOrbits(ctx, width, height, time, prior, precision)` — VisionStream canvas renderer

## Logging
- `[PulseStream]` — step advances, first interaction, completion
- `[VisionStream]` — exploration threshold reached
- `[CoreStream]` — sandbox exploration
