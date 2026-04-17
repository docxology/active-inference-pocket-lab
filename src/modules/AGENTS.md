# AGENTS.md — modules/

## Purpose

Per-module stream implementations. Each module has three parallel experience streams (Pulse, Vision, Core).

## Structure

- `moduleN/` → contains `PulseStream.jsx`, `VisionStream.jsx`, `CoreStream.jsx`, co-located CSS, `index.js` barrel

## Module Expansion Workflow

1. Create `src/modules/moduleN/` with 3 stream components + CSS + barrel
2. Import and register in `ModulePage.jsx` → `MODULE_STREAMS[N]`
3. Set `available: true` in `data/modules.js`

## Stream Conventions

- **Pulse**: Conversational, 2-min micro-inferences, high-school math
- **Vision**: Canvas/SVG animation, responds to slider in real-time
- **Core**: LaTeX via `MathBlock`, derivation steps, sandbox in `Drawer`
- Every module starts with a physical action ("The First Threshold")

## Current Status

- Modules 1–10: each folder exports `PulseStream`, `VisionStream`, and `CoreStream` via `index.js`.
