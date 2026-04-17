# **tests**/

Unit and integration tests for Spin. **65 tests** in **11** files (run `npm test` / see `doc/testing.md`).

## Layout

```
__tests__/
├── App.test.jsx
├── components/     InferenceSlider, StreamSwitcher, Quiz
├── contexts/       AppContext, ActivityBank
├── data/           modules.test.js (registry, quiz, glossary keys)
├── modules/        Module1Pulse, moduleStreams (all 10 bundles)
├── utils/          haptics, logger
```

## Running

```bash
npm test              # All tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Adding tests

1. Mirror structure under `src/__tests__/`
2. Use real contexts and localStorage (no mocks, except `vi.fn()` for callbacks)
3. Update `doc/testing.md` when the suite grows
