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
| `test.setupFiles` | `./src/test/setup.js` | localStorage polyfill + jest-dom |

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
| @vitejs/plugin-react | ^4 | React plugin for Vite |
| vitest | ^4 | Test runner |
| @testing-library/react | ^16 | Component test utilities |
| @testing-library/jest-dom | ^6 | DOM assertion matchers |
| jsdom | ^26 | Test DOM environment |
| eslint | ^9 | Code linting |
| prettier | ^3 | Code formatting |

## Deployment

### Static Hosting (Recommended)
Build and deploy `dist/`:
```bash
npm run build
# Upload dist/ to Netlify, Vercel, GitHub Pages, etc.
```

### SPA Routing
Configure your host to redirect all routes to `index.html` (since we use BrowserRouter):
- **Netlify**: `_redirects` file with `/* /index.html 200`
- **Vercel**: `vercel.json` with `rewrites`
- **GitHub Pages**: Use HashRouter instead (requires code change)

## LocalStorage Keys

| Key | Context | Data |
| --- | --- | --- |
| `spin_activity_bank` | ActivityBankContext | Pause state, bookmarks, sessions, streak |
| `spin_module_progress` | AppContext | Progress per module per stream (0-100) |

## Orchestration (`run.sh`)

Use the `run.sh` thin orchestrator at the repository root as the primary command interface:
- `./run.sh` - Full pipeline (install, test, dev server)
- `./run.sh test` - Execute tests
- `./run.sh build` - Production bundle

## Future Configuration TODOs

- [ ] PWA manifest (`manifest.json`) for installability
- [ ] Service worker for offline support
- [ ] IndexedDB for larger data storage
- [ ] Dark/light theme toggle (currently dark-only)
