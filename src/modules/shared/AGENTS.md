# AGENTS.md — modules/shared/

Cross-module helpers for streams.

## Files

| File | Role |
| --- | --- |
| `useStreamProgress.js` | Progress + completion callbacks for `StreamTemplate` streams |
| `GlossaryTermsLine.jsx` (+ `.css`) | Renders 2–4 `GlossaryLink`s from `getModuleById(moduleId).glossary` |
| `getCoreRetrievalBeat.jsx` | Factory for the final Core beat (`id: retrieval`) using `ModuleRetrievalQuiz` |
| `ModuleRetrievalQuiz.jsx` | Renders `Quiz` from the registry for a fixed `moduleId` |
