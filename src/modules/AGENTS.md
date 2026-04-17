# AGENTS.md — modules/

## Purpose

Per-module stream implementations. Each module has three parallel experience streams (Pulse, Vision, Core).

## Structure

- `moduleN/` → contains `PulseStream.jsx`, `VisionStream.jsx`, `CoreStream.jsx`, co-located CSS, `index.js` barrel
- `shared/` → `useStreamProgress.js`, `GlossaryTermsLine.jsx`, `getCoreRetrievalBeat.jsx`, `ModuleRetrievalQuiz.jsx`

## Registry integration

- **`data/modules.js`**: each module defines `quiz` (3 questions: `prompt`, `options[]`, `correctIndex`, `explanation`) and `glossary` (keys into `data/glossary.js`).
- **Core**: append `getCoreRetrievalBeat(id)` to `beats`, or mount `ModuleRetrievalQuiz` (Module 1) so the stream ends with the registry quiz.
- **Glossary UI**: `components/interactive/GlossaryLink.jsx`, `GlossaryChips.jsx`; Pulse uses `GlossaryTermsLine` for 2–4 terms; Vision uses chips or a repeated widget where a beat would otherwise be prose-only.

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
