# modules/

Per-module stream implementations for Spin's 10 Active Inference modules.

## Structure

Each module lives in `moduleN/` and contains three stream components plus a barrel export:

```
moduleN/
├── PulseStream.jsx    — "The Enthusiast" experience
├── PulseStream.css    — Pulse styles
├── VisionStream.jsx   — "The Artist" experience
├── VisionStream.css   — Vision styles
├── CoreStream.jsx     — "The Academic" experience
├── CoreStream.css     — Core styles
└── index.js           — Barrel export
```

`shared/` holds cross-module helpers: `useStreamProgress`, `GlossaryTermsLine`, `getCoreRetrievalBeat`, `ModuleRetrievalQuiz`.

## Module status

All **10** directories (`module1` … `module10`) are implemented and registered in `ModulePage.jsx` with `available: true` in `src/data/modules.js`.

## Adding a module

1. Create `src/modules/moduleN/` directory
2. Implement `PulseStream.jsx`, `VisionStream.jsx`, `CoreStream.jsx` (+ CSS)
3. Create `index.js` barrel export
4. Register in `src/pages/ModulePage.jsx` → `MODULE_STREAMS` map
5. Add a full entry in `src/data/modules.js` (including `quiz`, `glossary`, `available: true`)
6. Add README.md + AGENTS.md to the new directory

See `CONTRIBUTING.md` and `docs/modules-guide.md` for stream content requirements.
