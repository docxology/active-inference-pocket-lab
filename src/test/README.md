# test/

Test infrastructure and setup for Vitest.

## Files

### `setup.js`
Test setup file loaded before every test suite (configured in `vite.config.js`):
- **localStorage polyfill** for jsdom environments
- **Jest DOM matchers** via `@testing-library/jest-dom`

## Configuration

Testing is configured in `vite.config.js`:
```js
test: {
  globals: true,           // No need to import describe/it/expect
  environment: 'jsdom',    // DOM simulation
  setupFiles: './src/test/setup.js',
}
```

## Running Tests

```bash
npm test              # Single run
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Test Policy

- **No mocks** — Use real methods and real contexts
- Assert on rendered output via `@testing-library/react`
- Use `vi.fn()` only for callback verification (not for mocking implementations)
