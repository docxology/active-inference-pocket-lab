# Testing

Use the [locked setup](README.md#start-the-lab-locally), then run the release
gate and browser suite from the repository root.

```bash
./run.sh verify
npm exec -- playwright install chromium
./run.sh browser
```

The release gate runs ESLint with zero warnings, Vitest, and a production
build. `./run.sh test` runs Vitest alone. `npm run test:watch` is available
for local iteration. The suite prints the current test totals.

## Unit and integration checks

[Vitest configuration](../vite.config.js) selects the
[`src/__tests__/`](../src/__tests__/) tree with jsdom, CSS support, and
[jest-dom setup](../src/test/setup.js). Tests exercise actual state,
storage, numerical functions, and rendered controls. `vi.fn()` is used
for callback assertions.

- [Numerical helpers](../src/__tests__/utils/activeInference.test.js)
  check Gaussian identities, categorical expected free energy, and invalid inputs.
- [Learning continuity](../src/__tests__/components/LearningContinuity.test.jsx)
  checks completion boundaries, saved steps, explicit pause, and math controls.
- [Module registry](../src/__tests__/data/modules.test.js) and
  [equation checks](../src/__tests__/modules/equations.test.js) verify quiz
  and glossary metadata and parse the source equations with KaTeX.

## Browser checks

The [Playwright configuration](../playwright.config.js) runs a production
preview at mobile and desktop viewport sizes.
[Browser scenarios](../tests/browser/app.spec.js) exercise stream beats and
retrieval, routing, settings, keyboard focus, bad storage, offline loading of
an unopened module, and a worker update with progress and a retired chunk.
Checks cover horizontal overflow, runtime exceptions, equation errors, and
serious or critical accessibility violations in the configured axe rules.
Manual assistive-technology and physical-device checks cover additional conditions.

Set `SPIN_BASE_URL` to test an existing preview or deploy. The browser suite
uses isolated profiles and includes storage reset and worker-update scenarios.
Set `SPIN_BROWSER_OUTPUT` to change the evidence directory from `test-results/`.
Screenshots and traces are retained on failure.

[GitHub Actions](../.github/workflows/verify.yml) installs the locked
dependencies, runs the release gate and dependency audit, then installs
Chromium with its Linux dependencies and runs the browser suite.
