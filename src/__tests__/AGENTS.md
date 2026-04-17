# AGENTS.md — **tests**/

## Purpose

Unit and integration test suites for all Spin components.

## Structure

- `App.test.jsx` — Root app rendering and routing
- `components/` — InferenceSlider, StreamSwitcher tests
- `contexts/` — ActivityBank state management tests
- `data/` — Module registry validation tests
- `modules/` — Module stream rendering tests

## Test Helpers

- `renderWithProviders(ui)` — Wraps component in BrowserRouter + AppProvider + ActivityBankProvider
- `vi.fn()` — Used only for callback assertions

## Coverage: 52 tests in 9 files (run `npm test`)

## Adding Tests

- Mirror the `src/` structure
- Wrap in providers for context-dependent components
- No mocks — real localStorage, real contexts
