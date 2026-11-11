# TODO.md — canonical backlog

Single source of truth for open work in this repo. The TODO checklist in
[README.md](README.md) is a historical record; do not add new items there.

Legend: Minor = doc/link hygiene; Medium = accuracy or orientation debt;
Major = needs a decision or significant work.

## Completed

### Round 2 (2026-08-31)

- [x] Minor: verify src/__tests__ docs fully de-counted — confirmed clean (`grep -rn "65 tests|11 files" README.md docs/ src/` = only intentional TODO.md mentions)
- [x] Medium: docs/testing.md inventory dated "as of 2026-08-29, verify with npm test" (done Round 1; re-checked) — counts independently reconciled: 56 static `it(` + 9 loop-generated = 65 across 11 files on disk
- [x] Medium: finish doc/ → docs/ rename — commit c7248f6 (11 staged deletions committed after verifying docs/ holds equivalent content; 22 untracked module/status AGENTS+README files tracked)

### Round 1 (2026-08-31 agent-ergonomics pass)

- [x] Fix 7 stale `doc/` references after `doc/` → `docs/` rename (README.md, AGENTS.md, CONTRIBUTING.md, src/components/AGENTS.md, src/__tests__/{README,AGENTS}.md, src/__tests__/data/README.md, src/modules/README.md) — verify: `grep -rn "doc/" --include="*.md" .`
- [x] Create TODO.md as canonical backlog (this file)
- [x] Link TODO.md and manuscript status from README.md orientation ladder
- [x] Replace hardcoded test counts in README.md with pointer to `docs/testing.md`

## Major (scoped — owner decision required)

- [ ] Offline storage with IndexedDB (beyond installable shell)
  Acceptance: progress/bookmark/streak state survives clearing localStorage; reads/writes go through a storage adapter in `src/contexts/` so UI code is unchanged; fallback to localStorage when IndexedDB unavailable; `npm test` green with adapter covered by tests.
- [ ] Server-synced progress
  Acceptance: blocked on backend existing — define sync API contract + conflict policy (last-write-wins vs merge) with owner before any client code lands. Do not start without an owner-approved spec.
- [ ] Hearth social features (shared questions, group streaks)
  Acceptance: blocked on product decision — which social primitives ship, moderation policy, and data model. Scope with owner; no partial implementation without it.
- [ ] Full accessibility pass (screen reader + keyboard)
  Acceptance: navigate all 10 modules + settings + glossary with VoiceOver only; every interactive element reachable and operable by keyboard; axe scan with zero critical violations; fixes land per-module with `npm test` green.
- [ ] Performance profiling for canvas animations
  Acceptance: profile Vision-stream canvas animations on a mid-tier mobile device; record baseline FPS; only optimize if any module drops below 30 FPS sustained; results documented in docs/ before/after.

## Workflowz review — 2026-11-10

- [ ] WFZ-20261110-01 — P2: Refresh streak and four-week activity state at local midnight without requiring another session or reload.
  Evidence: `src/contexts/ActivityBankContext.jsx:104-132,177` computes from `new Date()` but memoizes only on `state.sessions`; `src/pages/HearthPage.jsx:20-39` likewise captures the current day while depending only on `sessions`. An open tab can therefore retain an expired streak and stale “today” bucket after midnight.
  Outcome: both Home/Hearth streak displays and the Hearth 28-day chart roll over automatically while the app remains open, preserve existing local-calendar and today-or-yesterday semantics, and clean up their date-change scheduling on unmount.
  Acceptance: add a regression covering a previously active streak becoming ineligible after an idle midnight rollover and a chart day advancing without new storage activity; from the repo root run `./run.sh test -- src/__tests__/contexts/ActivityBank.test.jsx && ./run.sh browser -- --grep "midnight"`, expecting the new unit and mobile/desktop browser cases to pass.
  Dependencies/constraints: none; do not change stored timestamps or penalize the existing yesterday grace rule.

- [ ] WFZ-20261110-02 — P2: Make the exported badge registry canonical instead of maintaining two divergent badge systems.
  Evidence: `src/data/badges.js:30-155` exports ten badges and `evaluateBadges`, but has no importer; `src/pages/HearthPage.jsx:42-138,145-147` separately defines and evaluates fifteen badges with different IDs, labels, and completion thresholds.
  Outcome: move the fifteen currently displayed Hearth definitions into the shared data module, consume the shared evaluator from Hearth, delete the duplicate local registry, and preserve the currently displayed badges and their earning behavior.
  Acceptance: add threshold and Hearth-integration regressions; run `./run.sh test -- src/__tests__/data/badges.test.jsx && ./run.sh browser -- --grep "Hearth badges"` from the repo root, expecting every current badge case and the Hearth integration case to pass in both browser projects.
  Dependencies/constraints: none; preserve the live fifteen-badge UX rather than silently replacing it with the currently unused ten-badge set.

- [ ] WFZ-20261110-03 — P2: Align deployment and configuration documentation with the actual tested runtime and build.
  Evidence: `.node-version:1` pins Node `26.13.0` and `.github/workflows/verify.yml:15` uses it, while `netlify.toml:6` deploys Node `24` and `docs/configuration.md:141` claims both CI and Netlify use 24. The same document omits `offlineBundle` at `docs/configuration.md:8-20` versus `vite.config.js:7-28,33`, gives the wrong format command at `docs/configuration.md:45` versus `package.json:11`, and says KaTeX `^0.16` at `docs/configuration.md:77` versus `^0.19.0` at `package.json:26`.
  Outcome: set Netlify `NODE_VERSION` from current `24` to target `26.13.0`, matching the existing CI pin, and update the configuration examples/tables to the current Vite offline plugin, Prettier script, and KaTeX range.
  Acceptance: run `node --input-type=module -e 'import fs from "node:fs"; import assert from "node:assert/strict"; const pin=fs.readFileSync(".node-version","utf8").trim(); assert.equal(pin,"26.13.0"); assert.match(fs.readFileSync("netlify.toml","utf8"),/NODE_VERSION = "26\.13\.0"/); const docs=fs.readFileSync("docs/configuration.md","utf8"); for (const text of ["offlineBundle", pin, "prettier --write \\"src/**/*.{js,jsx,css,md}\\"", "katex | ^0.19.0"]) assert.ok(docs.includes(text), text);' && ./run.sh verify`, expecting the assertions and release gate to exit zero.
  Dependencies/constraints: confirm Netlify accepts the already-selected Node 26.13.0 when applying the deployment change; no dependency upgrade or engine-range change is requested.

- [ ] WFZ-20261110-04 — P3: Replace the stale generated placeholder for implemented shared learning utilities.
  Evidence: `src/modules/shared/README.md:1-4` still says “Status: SKELETON” and “fleet pass in progress,” although the directory contains production `useStreamProgress.js`, `useLearningPosition.js`, `GlossaryTermsLine.jsx`, and `getCoreRetrievalBeat.jsx`.
  Outcome: document the actual hooks/components, their progress/bookmark/timer and registry responsibilities, and their import paths; remove the generated skeleton notice.
  Acceptance: run `node -e 'const fs=require("node:fs"); const s=fs.readFileSync("src/modules/shared/README.md","utf8"); if (/SKELETON|fleet pass in progress/.test(s) || !["useStreamProgress","useLearningPosition","GlossaryTermsLine","getCoreRetrievalBeat"].every(x=>s.includes(x))) process.exit(1)'` from the repo root, expecting exit zero.
  Dependencies/constraints: documentation only; do not alter the immutable seed document.
