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
