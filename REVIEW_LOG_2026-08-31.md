# Review Log — 2026-08-31 (agent-ergonomics deep pass)

Fleet lane: active-inference-pocket-lab (agent-erg fleet 20260831).

## Phase 0 - Preflight
- Branch: main; remote: origin (github.com/docxology/active-inference-pocket-lab). Fetch OK; in sync before work.
- Dirty at dispatch: 34 entries - pre-existing staged doc/* deletions (11) and untracked docs-tree/module AGENTS+README files. All treated as pre-existing; none touched except doc-accuracy edits listed below.

## Phase 1 - Cold-start audit
Read README.md first, as a cold agent. Scores:
- (a) Determine current status: FAIL before - no status surface linked from README; manuscript status exists (docs/manuscript/MANUSCRIPT_STATUS.md) but not referenced. PASS now (README "Status and next actions" section).
- (b) Find what to do next: FAIL before - README TODO checklist unversioned, no canonical backlog. PASS now (TODO.md created, linked).
- (c) Find how to run primary verification: PASS before (./run.sh / npm test documented; Quick Start accurate).
- Broken links: 2 found (CONTRIBUTING.md to doc/...); fixed. Re-checked all .md: 0 broken.
- Stale claims: 7 stale doc/ references post-rename (commit beddf9f deleted doc/); "65 tests, 11 files" hardcoded in 6 places (unverifiable in this session - see Phase 4 note).

## Phase 3 - Implemented
- Fixed all stale doc/ refs (README.md, AGENTS.md, CONTRIBUTING.md, src/components/AGENTS.md, src/__tests__/README.md, src/__tests__/AGENTS.md, src/__tests__/data/README.md, src/modules/README.md).
- TODO.md created (canonical backlog); README TODO demoted to historical with pointer.
- README gained status/next-actions section (orientation ladder).
- docs/testing.md inventory marked dated + verify-with command; hardcoded counts removed from README and src/__tests__ docs.
- Link checker re-run: 0 broken.

## Phase 4 - Verification note (honest)
- npx vitest run could NOT complete on this external-drive checkout: all 11 test files fail with "Failed to start forks worker ... Timeout waiting for worker to respond" (3 attempts: default, pool flag variants, --no-file-parallelism). This is an environment/volume limitation, not evidence of test failure. A human on a fast volume: run npm test.
- Therefore the "65 tests" counts were NOT re-verified; docs now point to npm test instead of asserting numbers.
- ESLint also exceeded 300s on this volume - not run to completion.
