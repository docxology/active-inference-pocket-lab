# Configuration

## Runtime and scripts

Use the Node.js version in [`.node-version`](../.node-version) to match
[GitHub Actions](../.github/workflows/verify.yml). The orchestrator accepts
Node 20.19+ in the 20 line, 22.12+ in the 22 line, and major versions 24 and
later. The [Netlify build environment](../netlify.toml) selects Node 24.
[`package.json`](../package.json) declares package ranges, including KaTeX
`^0.19.0`. `npm ci` installs the locked versions.

| Command | Behavior |
| --- | --- |
| `./run.sh` | Install missing dependencies, test, and start the development server |
| `./run.sh dev` | Start Vite on port 5173 with LAN access when allowed |
| `./run.sh verify` | Enforce lint with zero warnings, run Vitest, and produce `dist/` |
| `./run.sh preview` | Build, then preview the production bundle on port 4173 by default |
| `./run.sh browser` | Run the production browser and accessibility suite |
| `npm run format` | Apply `prettier --write "src/**/*.{js,jsx,css,md}"` |

See [Testing](testing.md) for browser setup and environment overrides. The
app requires no environment variables.

## Production build and hosting

[`vite.config.js`](../vite.config.js) uses the React plugin and
`offlineBundle`. The latter generates `dist/sw.js` from
[`public/sw.js`](../public/sw.js) with a bundle-specific cache version and
a list of build assets. After a successful production worker install, the
cache includes the shell and bundled lazy module chunks. A waiting worker
can be activated through the update control. The worker retains one
previous Spin cache to serve retired chunks for existing tabs.

Deploy `dist/` with a fallback to `index.html` for client-side routes.
[`netlify.toml`](../netlify.toml) runs `./run.sh verify`, publishes
`dist/`, configures SPA routing, and sets cache headers. The PWA shell
and app icons are in [`public/`](../public/).

## Browser storage

| LocalStorage key | Data |
| --- | --- |
| `spin_module_progress` | Completion per module and stream |
| `spin_stream_positions` | Saved step per module and stream |
| `spin_stream_choices` | Last selected stream per module |
| `spin_activity_bank` | Pause, bookmark, activity, and saved questions |
| `spin_settings` | Display, feedback, default stream, and bookmark preferences |

Progress is saved in the browser for the current origin. Clearing site
data removes it. Storage reads validate records and fall back when
the stored values cannot be read or used.
