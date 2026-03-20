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
}
```

**`src/test/setup.js`**:
- localStorage polyfill for jsdom
- `@testing-library/jest-dom` matchers

## Test Policy

1. **No mocks** — Use real methods, real contexts, real localStorage
2. **`vi.fn()`** is allowed only for verifying callbacks were called
3. **`renderWithProviders()`** helper wraps components in `BrowserRouter` + `AppProvider` + `ActivityBankProvider`
4. **ARIA first** — Prefer `getByLabelText`, `getByRole` over `getByText`

## Test Inventory (31 tests, 6 suites)

### App.test.jsx (3 tests)
- Renders home page by default
- Renders bottom navigation with 5 tabs
- Renders quick start button

### InferenceSlider.test.jsx (6 tests)
- Renders with default value
- Renders with custom value and unit
- Calls onChange when value changes
- Renders range labels when provided
- Uses custom formatValue function
- Has proper ARIA attributes

### StreamSwitcher.test.jsx (4 tests)
- Renders all three stream tabs
- Shows Pulse as active by default
- Switches streams on click
- Has proper ARIA role structure

### ActivityBank.test.jsx (5 tests)
- Starts with default state
- Pauses and resumes
- Sets and clears bookmarks
- Records activity and tracks total minutes
- Persists state to localStorage

### modules.test.js (8 tests)
- Exports 10 modules
- Each module has required fields
- Module IDs are sequential 1-10
- getModuleById returns correct module
- getModuleBySlug returns correct module
- getAvailableModules returns only available modules
- Module 1 is available
- Each module slug is unique

### Module1Pulse.test.jsx (5 tests)
- Renders the opening question
- Renders the prior belief slider
- Shows continue button after slider interaction
- Has step progress dots
- Has proper ARIA tabpanel role

## Running Tests

```bash
npm test                # Run all tests once
npm run test:watch      # Watch mode (re-run on changes)
npm run test:coverage   # Generate coverage report
```

## Adding Tests

1. Create test file in `src/__tests__/` mirroring the source structure
2. Import component and required providers
3. Use `renderWithProviders()` for context-dependent components
4. Assert on rendered output, not internal state
5. Add README documentation for the test subdirectory
