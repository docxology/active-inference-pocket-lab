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

- localStorage polyfill for jsdom
- `@testing-library/jest-dom` matchers

## Test Policy

1. **No mocks** — Use real methods, real contexts, real localStorage
2. **`vi.fn()`** is allowed only for verifying callbacks were called
3. **`renderWithProviders()`** helper (where used) wraps components in `BrowserRouter` + `AppProvider` + `ActivityBankProvider`
4. **ARIA first** — Prefer `getByLabelText`, `getByRole` over `getByText`

## Test Inventory (65 tests, 11 files)

Totals from `vitest run` (update this section when the suite changes).

### AppContext.test.jsx (9 tests)

- Default stream state
- Switches streams / sets module / updates progress
- Clamps progress, persists to localStorage
- Module and overall progress averages
- Throws outside provider

### haptics.test.js (7 tests)

- Detect support / no support
- light, medium, success, reward patterns
- No throw when vibration unsupported

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
