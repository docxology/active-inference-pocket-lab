# AGENTS.md — src/

## Purpose

Root source directory for the Spin Active Inference Pocket Lab.

## Structure

- `main.jsx` — Entry point, mounts `<App />` with global styles; registers service worker in production
- `App.jsx` — Root component, BrowserRouter, `SettingsProvider` → `AppProvider` → `ActivityBankProvider`, lazy route chunks

## Dependencies

- All components import design tokens via CSS `@import` chain
- Contexts provide global state to the entire component tree
- Module streams are lazy-loaded via `MODULE_STREAMS` map in `ModulePage.jsx` (keys `1`–`10`)
- Module metadata, `quiz`, and `glossary` keys: `src/data/modules.js`

## Conventions

- JSDoc on all exports
- `[ComponentName]` prefixed console logs
- No inline CSS values — use `design-tokens.css` variables
- Minimum 48×48px touch targets
- No mock methods in tests — real methods only
