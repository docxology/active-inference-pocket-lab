# AGENTS.md — **tests**/

## Purpose

Unit and integration test suites for Spin.

## Structure

- `App.test.jsx` — Root app rendering and routing
- `components/` — InferenceSlider, StreamSwitcher, Quiz
- `contexts/` — AppContext, ActivityBank
- `data/` — Module registry, quiz schema, glossary keys
- `modules/` — Module 1 Pulse smoke tests; `moduleStreams.test.js` imports all 10 bundles
- `utils/` — Haptics, logger

## Test helpers

- `renderWithProviders(ui)` — Used in some tests: BrowserRouter + AppProvider + ActivityBankProvider
- `vi.fn()` — Only for callback assertions

## Coverage

Run `npm test` — **65 tests** in **11** files (Vitest). Refresh `doc/testing.md` when counts change.

## Adding tests

- Mirror the `src/` structure
- Wrap in providers for context-dependent components (`ActivityBankProvider` for Quiz)
- No mocks — real localStorage, real contexts
