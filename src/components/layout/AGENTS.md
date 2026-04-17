# AGENTS.md — components/layout/

## Purpose

Application structure and navigation shell components.

## Components

- `AppShell.jsx` — Root layout, wraps `<Outlet>` + `<BottomNav>`
- `TopBar.jsx` — Brand + quick links (search, glossary, settings)
- `BottomNav.jsx` — 5-tab bottom nav (Home, Modules, Hearth, Map, Pause)
- `StreamSwitcher.jsx` — Pulse/Vision/Core tab bar with animated indicator
- `StreamTemplate.jsx` — Shared step-through shell for module streams (beats + dots + continue)
- `StreamErrorBoundary.jsx` — Catches stream render/chunk failures with retry
- `RouteFallback.jsx` — Lightweight lazy-route placeholder
- `Drawer.jsx` — Slide-up panel with spring physics, overlay, drag-to-close

## Dependencies

- `react-router-dom` — Navigation and active route detection
- `framer-motion` — Drawer spring animation and drag gestures
- `AppContext` — StreamSwitcher reads/writes `activeStream`

## Conventions

- Co-located `.css` files for each component
- Nav tabs have `aria-label` and `aria-current` attributes
- StreamSwitcher uses `role="tablist"` / `role="tab"` pattern
- Drawer always has overlay backdrop for accessibility
