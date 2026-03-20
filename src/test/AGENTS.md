# AGENTS.md — test/

## Purpose
Test infrastructure and Vitest setup.

## Files
- `setup.js` — localStorage polyfill + jest-dom matchers

## Configuration
- Configured in `vite.config.js` → `test.setupFiles`
- Environment: `jsdom`
- Globals: `true` (no import needed for describe/it/expect)

## Policy
- No mocks — real methods only
- `vi.fn()` only for callback verification
- `@testing-library/react` for rendering and queries
