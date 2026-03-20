# __tests__/

Unit and integration test suites for Spin.

## Test Organization

```
__tests__/
├── components/
│   ├── InferenceSlider.test.jsx   — Slider rendering, ARIA, value changes
│   └── StreamSwitcher.test.jsx    — Tab rendering, switching, roles
├── contexts/
│   └── ActivityBank.test.jsx      — Pause/resume, bookmarks, persistence
├── data/
│   └── modules.test.js            — Registry structure, lookups, availability
├── modules/
│   └── Module1Pulse.test.jsx      — Pulse stream rendering, interaction
└── App.test.jsx                   — Root app rendering, nav, routing
```

## Test Results (31/31 ✅)

| Suite | Tests | Focus |
| --- | --- | --- |
| App.test.jsx | 3 | Home page render, nav, quick start |
| InferenceSlider.test.jsx | 6 | Value, onChange, labels, format, ARIA |
| StreamSwitcher.test.jsx | 4 | Tabs, default active, switching, roles |
| ActivityBank.test.jsx | 5 | Pause, resume, bookmarks, sessions, persistence |
| modules.test.js | 8 | 10 modules, required fields, IDs, lookups |
| Module1Pulse.test.jsx | 5 | Opening text, slider, continue, dots, ARIA |

## Running

```bash
npm test              # All tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Adding Tests

1. Create `ComponentName.test.jsx` in the appropriate subdirectory
2. Wrap components requiring context in `renderWithProviders()` helper
3. Use real methods (no mocks per project policy)
4. Import from `@testing-library/react` for queries
