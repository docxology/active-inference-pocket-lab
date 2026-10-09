# Testing

Test strategy, inventory, and coverage for Spin.

## Stack

| Tool | Purpose |
| --- | --- |
| Vitest 4 | Test runner (Vite-native) |
| Testing Library | Component rendering + DOM queries |
| jest-dom | Custom DOM matchers (`toBeInTheDocument`, etc.) |
| jsdom | Browser-like DOM environment |

## Configuration

**`vite.config.js`**:

```js
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
  css: true,
},
```

**`src/test/setup.js`**:

- Real jsdom DOM Storage, isolated between tests
- `@testing-library/jest-dom` matchers

## Test Policy

1. **No mocks** — Use real methods, real contexts, real localStorage
2. **`vi.fn()`** is allowed only for verifying callbacks were called
3. **`renderWithProviders()`** helper (where used) wraps components in `BrowserRouter` + `AppProvider` + `ActivityBankProvider`
4. **ARIA first** — Prefer `getByLabelText`, `getByRole` over `getByText`

## Test Inventory

> 105 unit/integration tests across 16 files passed on 2026-10-09. Counts below were accurate as of 2026-10-09 (verify current totals with `npm test` — do not quote them elsewhere; this is the only place they live).

### AppContext.test.jsx (12 tests)

- Default stream state
- Switches streams / sets module / updates progress
- Clamps progress, persists to localStorage
- Module and overall progress averages
- Throws outside provider

### haptics.test.js (6 tests)

- Real unsupported vibration API detection
- Each feedback action remains safe without hardware support
- Disabled feedback preference

### logger.test.js (5 tests)

- Prefix, collection, level filter, clear, error level

### App.test.jsx (3 tests)

- Home by default, bottom nav, hero links to first module

### InferenceSlider.test.jsx (6 tests)

- Default and custom value, onChange, labels, formatValue, ARIA

### StreamSwitcher.test.jsx (4 tests)

- Tabs, default Pulse, switch on click, roles

### ActivityBank.test.jsx (5 tests)

- Default state, pause/resume, bookmark, activity, persist

### modules.test.js (10 tests)

- 10 modules, required fields, IDs 1–10
- getModuleById / getModuleBySlug
- getAvailableModules, unique slugs
- All 10 available
- Quiz schema (3 questions, fields) per module
- Glossary key lists non-empty strings

### moduleStreams.test.js (10 tests)

- Each `module1`…`module10` barrel exports Pulse, Vision, Core

### Module1Pulse.test.jsx (5 tests)

- Opening copy, slider, continue after interaction, dots, ARIA

### Quiz.test.jsx (1 test)

- Module 1 registry `quiz` renders inside `ActivityBankProvider`

## Running Tests

```bash
npm test                # Run all tests once (same as vitest run)
npm run test:watch      # Watch mode (re-run on changes)
npm run test:coverage   # Generate coverage report
```

## Adding Tests

1. Create test file in `src/__tests__/` mirroring the source structure
2. Import component and required providers (`ActivityBankProvider` for Quiz)
3. Use `renderWithProviders()` where the project already defines it
4. Assert on rendered output, not internal state
5. Update this document’s counts and bullets when adding files or cases


## Regression additions (2026-10-09)

- `utils/activeInference.test.js` (12): Gaussian posterior arithmetic, exact evidence/free-energy identity at and away from the optimum, negative continuous surprisal, invalid precision, stable softmax, impossible-event KL, categorical EFE, interpolation and descent.
- `utils/persistence.test.js` (11): real Storage round trips, malformed JSON, invalid records/fields, preferences, activity collections and dates.
- `components/LearningContinuity.test.jsx` (3): final-step entry is not completion, one activity receipt, saved-step remount, math preference and rejection of trusted HTML commands.
- `components/Drawer.test.jsx` (1): initial focus, forward/backward Tab containment, Escape and focus restoration.
- `modules/equations.test.js` (11): render actual JSX literal equations with strict KaTeX parsing and reject incorrectly doubled command backslashes.
- AppContext adds provider-remount persistence, stored-shape validation and monotonic completion.

## Browser workflow

`./run.sh browser` starts a production preview and runs `tests/browser/app.spec.js` at 390×844 and 1280×900. There are 92 scenarios: all 30 streams in both viewports, ten routes, and pause/resume/reload, settings, drawer/tab keyboard operation, malformed storage, an unvisited module loaded offline after worker installation, and a real worker update preserving progress and access to a retired chunk. Every stream beat and Core retrieval quiz is exercised. Axe must report zero critical or serious WCAG A/AA violations. Checks also fail on runtime exceptions, equation errors, error overlays and horizontal overflow. Traces, screenshots and full axe results are retained on failure.

Browser profiles are disposable and use real page methods, real network requests, DOM Storage and service workers. Set `SPIN_BASE_URL` to check an existing preview or deploy; `SPIN_BROWSER_OUTPUT` relocates browser evidence. Physical mobile performance and VoiceOver listening remain separate manual checks; automated axe coverage is not a full screen-reader certification.

Use `./run.sh verify` before release; GitHub Actions also runs dependency auditing and browser QA. Lint failures and warnings block the orchestrator instead of being suppressed. Tests use real storage and logger receipts; hardware/console mocking has been removed. `vi.fn()` is retained only for callback assertions permitted by local guidance.
