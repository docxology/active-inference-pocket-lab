# TODO.md — canonical backlog

Single source of truth for open work in this repo. The TODO checklist in
[README.md](README.md) is a historical record; do not add new items there.

Legend: Minor = doc/link hygiene; Medium = accuracy or orientation debt;
Major = needs a decision or significant work.

## Completed (2026-08-31 agent-ergonomics pass)

- [x] Fix 7 stale `doc/` references after `doc/` → `docs/` rename (README.md, AGENTS.md, CONTRIBUTING.md, src/components/AGENTS.md, src/__tests__/{README,AGENTS}.md, src/__tests__/data/README.md, src/modules/README.md) — verify: `grep -rn "doc/" --include="*.md" .`
- [x] Create TODO.md as canonical backlog (this file)
- [x] Link TODO.md and manuscript status from README.md orientation ladder
- [x] Replace hardcoded test counts in README.md with pointer to `docs/testing.md`

## Minor

- [ ] [src/__tests__/README.md](src/__tests__/README.md) and [src/__tests__/AGENTS.md](src/__tests__/AGENTS.md) still say "65 tests in 11 files" — replace with `npm test` pointer (partially fixed: README/AGENTS in src/__tests__ updated; re-check after suite changes)

## Medium

- [ ] [docs/testing.md](docs/testing.md) hardcodes per-file test counts ("65 tests, 11 files") that rot on every suite change — either delete the per-file inventory or mark it "as of <date>, verify with `npm test`"
- [ ] Stage the pre-existing `doc/` → `docs/` rename (11 staged deletions + untracked docs/ tree and module AGENTS/README files) — the tree has been in a half-committed rename state since 2026-08-29 (commit beddf9f)

## Major

- [ ] Offline storage with IndexedDB (beyond installable shell) — see [README.md](README.md) historical TODO
- [ ] Server-synced progress (when backend is ready)
- [ ] Hearth social features (shared questions, group streaks)
- [ ] Full accessibility pass (screen reader + keyboard)
- [ ] Performance profiling for canvas animations
