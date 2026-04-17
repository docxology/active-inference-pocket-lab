# AGENTS.md — doc/

## Purpose

Comprehensive project documentation for Spin — The Active Inference Pocket Lab.

## Founding document

- `initial-pocket-lab-prompt.md` — **The Seed.** The original creative brief. **Do not modify its text**; treat it as read-only. All current behavior (10 modules, registry-driven quiz and glossary, lazy streams, PWA) is documented in the files below.

## Documentation files

| File | Role |
| --- | --- |
| `initial-pocket-lab-prompt.md` | Constitutional narrative and Module 1 mandate (immutable) |
| `philosophy.md` | The 6 rules with implementation mapping |
| `architecture.md` | Providers, routes, lazy `MODULE_STREAMS`, registry data flow |
| `design-system.md` | Tokens, typography, touch targets, accessibility |
| `modules-guide.md` | Triple streams, `quiz` / `glossary` registry, expansion |
| `api-reference.md` | Props and exports mirroring source |
| `testing.md` | Policy, inventory — **refresh test counts when the suite changes** |
| `configuration.md` | Vite, scripts, deployment, `public/` PWA assets |
| `logging.md` | `[ComponentName]` prefixes and logger usage |

## Maintenance

- After adding components, contexts, or data exports: update `api-reference.md`.
- After adding or removing tests: run `npm test` and update numeric lines in `testing.md` and root `README.md` if they quote totals.
- After routing or provider changes: update `architecture.md` and `configuration.md` as needed.
- Keep `modules-guide.md` aligned with `src/data/modules.js` and `src/pages/ModulePage.jsx`.
- Never edit the Seed body; link to other docs for “current Spin” instead.
