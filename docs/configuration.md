# Configuration

Build configuration, environment settings, and deployment options for Spin.

## Vite Configuration (`vite.config.js`)

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // Dev server port
    host: true,       // Expose to LAN (for mobile testing)
  },
  test: {
    globals: true,           // No explicit imports for describe/it/expect
    environment: 'jsdom',    // DOM simulation for tests
    setupFiles: './src/test/setup.js',
    css: true,               // Import CSS in tests
  },
});
```

### Key Settings

| Setting | Value | Purpose |
| --- | --- | --- |
| `server.port` | 5173 | Dev server port |
| `server.host` | true | Accessible from LAN devices (mobile testing) |
| `test.globals` | true | Vitest globals without imports |
| `test.environment` | jsdom | Browser-like DOM |
| `test.setupFiles` | `./src/test/setup.js` | real DOM Storage + jest-dom |
| `test.css` | true | Allow importing CSS in test modules |

## Package Scripts (`package.json`)

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `vite` | Start development server |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview production build |
| `test` | `vitest run` | Run tests once |
| `test:watch` | `vitest` | Watch mode testing |
| `test:coverage` | `vitest run --coverage` | Tests with coverage report |
| `lint` | `eslint .` | Run ESLint |
| `format` | `prettier --write .` | Format code with Prettier |

## Environment Variables

Currently none required. Future variables:

| Variable | Purpose | Status |
| --- | --- | --- |
| `VITE_API_URL` | Backend API endpoint | TODO |
| `VITE_ANALYTICS_ID` | Analytics tracking | TODO |

## Prettier Configuration (`.prettierrc`)

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

## Dependencies

### Runtime
| Package | Version | Purpose |
| --- | --- | --- |
| react | ^19 | UI framework |
| react-dom | ^19 | DOM rendering |
| react-router-dom | ^7 | Client-side routing |
| framer-motion | ^12 | Physics-based animations |
| katex | ^0.16 | LaTeX mathematical rendering |

### Development
| Package | Version | Purpose |
| --- | --- | --- |
| vite | ^8 | Build tool + dev server |
| @vitejs/plugin-react | ^6 | React plugin for Vite |
| vitest | ^4 | Test runner |
| @testing-library/react | ^16 | Component test utilities |
| @testing-library/jest-dom | ^6 | DOM assertion matchers |
| jsdom | ^29 | Test DOM environment |
| eslint | ^9 | Code linting |
| prettier | ^3 | Code formatting |

## Deployment

### Static Hosting (Recommended)
Build and deploy `dist/`:
```bash
./run.sh verify
# Upload dist/ to Netlify, Vercel, GitHub Pages, etc.
```

This repo includes **`netlify.toml`** at the root (build command, `publish = dist`, SPA redirect `/*` → `/index.html` 200, security headers). **`public/_redirects`** also supports Netlify-style hosting.

### SPA Routing
Configure your host to redirect all routes to `index.html` (since we use BrowserRouter):
- **Netlify**: `netlify.toml` + `_redirects` (see above)
- **Vercel**: `vercel.json` with `rewrites`
- **GitHub Pages**: Use HashRouter instead (requires code change)

## LocalStorage Keys

| Key | Context | Data |
| --- | --- | --- |
| `spin_activity_bank` | ActivityBankContext | Pause state, bookmarks, sessions, streak |
| `spin_module_progress` | AppContext | Progress per module per stream (0-100) |
| `spin_settings` | SettingsContext | Validated motion, haptics, sound, font scale, default stream, math and bookmark preferences |
| `spin_stream_positions` | AppContext | Step index per module and stream |
| `spin_stream_choices` | AppContext | Last selected stream per module |

## PWA (`public/`)

- `manifest.webmanifest` — installability and display metadata
- `sw.js` — service worker (registered from [`src/main.jsx`](../src/main.jsx) in production)
- `public/_redirects` — SPA fallback on Netlify (`/* /index.html 200`)

## Orchestration (`run.sh`)

Use the `run.sh` thin orchestrator at the repository root as the primary command interface:
- `./run.sh` - Full pipeline (install, test, dev server)
- `./run.sh test` - Execute tests
- `./run.sh build` - Production bundle

## Future Configuration TODOs

- [x] PWA shell — `manifest.webmanifest` + `sw.js` under `public/` (offline cache strategy can deepen over time)
- [ ] IndexedDB for larger offline data (beyond the installable shell)
- [ ] Dark/light theme toggle (currently dark-only; Settings has high-contrast + font scale)
- [ ] Optional env vars (`VITE_*`) when a backend or analytics layer lands


## Release gates and offline builds

Use Node.js 24 LTS in CI and Netlify. The orchestrator also accepts 20.19+, 22.12+, and newer even majors. `npm ci` installs the exact lockfile when dependencies are absent.

- `./run.sh lint` is non-mutating and fails on lint errors or warnings.
- `./run.sh verify` runs lint, unit/integration tests, and the production build; Netlify uses this command.
- `./run.sh browser` runs the Chromium mobile/desktop workflow in `tests/browser/app.spec.js`; install its browser with `npm exec playwright install chromium` first.
- GitHub Actions additionally checks dependency advisories and runs browser QA.

Vite generates `dist/sw.js` with the build's full asset inventory and a cache version derived from the bundle. Installation must fetch every bundled asset successfully. This covers unvisited modules and KaTeX fonts after installation. The worker serves its matching cached HTML shell, so a redeploy cannot mix new HTML with old JavaScript. `PwaStatus` offers waiting updates explicitly and displays connectivity. Only Spin caches are managed; one previous bundle is retained for other open tabs. Fonts requested from Google are optional and fall back to system fonts offline.

Progress remains device-local. Clearing site data removes it; IndexedDB and server synchronization are still backlog decisions, not implemented features.
