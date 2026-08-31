# AGENTS — active-inference-pocket-lab/public

Status: REAL (doc fleet, 2026-08-30)

Static web app shell assets served at the site root (PWA-style).

## Layout
- `favicon.svg`, `spin-icon.svg`, `icons.svg` — icons.
- `manifest.webmanifest` — PWA manifest.
- `sw.js` — service worker.
- `_redirects` — host redirect rules (Netlify-style) (unverified).

## Invariants
- Hand-editable config/assets, but contents are referenced by the app build — changing names requires updating the manifest/index references.
