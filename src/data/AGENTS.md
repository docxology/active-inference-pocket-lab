# AGENTS.md — data/

## Purpose

Static data layer: module registry and glossary.

## Files

- `modules.js` — 10-module registry: metadata, `streams`, `quiz` (three MCQs per module), `glossary` (keys into `glossary.js`), `available`
- `glossary.js` — Term definitions; `getGlossaryEntry`, `getAllGlossary`, `searchGlossary`
- `badges.js` — Hearth / proficiency badge definitions (where applicable)

## Lookup functions

- `getAllModules()` — all 10 modules
- `getModuleById(id)` — numeric ID (1–10) or string
- `getModuleBySlug(slug)` — URL slug
- `getAvailableModules()` — filtered list (currently all 10)

## Module availability

All 10 modules use `available: true` with stream bundles in `src/modules/module1` through `src/modules/module10`.

## Adding a new module

Add `moduleN/` streams, register in `ModulePage.jsx` → `MODULE_STREAMS`, extend `modules.js` with `quiz`, `glossary`, and related fields, and ensure new glossary keys exist in `glossary.js`.
