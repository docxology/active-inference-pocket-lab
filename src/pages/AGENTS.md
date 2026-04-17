# AGENTS.md — pages/

## Purpose

Route-level page components rendered by React Router inside AppShell.

## Pages

- `HomePage.jsx` — `/` — Landing with resume card, quick start
- `ModuleListPage.jsx` — `/modules` — All 10 module cards with progress
- `ModulePage.jsx` — `/modules/:moduleId` — Lazy triple streams + `StreamErrorBoundary` + `StreamSwitcher`
- `ProficiencyMapPage.jsx` — `/map` — Progress grid
- `HearthPage.jsx` — `/hearth` — Celebration, badges
- `PausePage.jsx` — `/pause` — Planned pause with bookmark
- `GlossaryPage.jsx` — `/glossary` — Terms with stable `id` anchors for deep links
- `SearchPage.jsx` — `/search` — In-app search
- `SettingsPage.jsx` — `/settings` — Preferences (motion, haptics, font scale, …)
- `NotFoundPage.jsx` — `*` — Unknown routes

## Key file: ModulePage.jsx

- `MODULE_STREAMS` map registers stream components per module ID
- To add a new module: import streams, add entry to `MODULE_STREAMS`
- Uses `useParams` for `moduleId`, `useApp` for `activeStream`

## Conventions

- Each page has co-located `.css` file
- Pages use the `.page` CSS class for consistent padding
- All pages wrapped in `.container` for max-width constraint
