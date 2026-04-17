# AGENTS.md — components/

## Purpose

Reusable UI components for Spin, split into `interactive/` and `layout/`.

## Subdirectories

- `interactive/` — Sliders, MathBlock, Quiz, glossary links, module-specific canvases (see `interactive/AGENTS.md`)
- `layout/` — AppShell, TopBar, BottomNav, StreamSwitcher, Drawer, StreamTemplate, RouteFallback, etc.

## Patterns

- Co-located `.css` where styles warrant a file
- `framer-motion` for physics-based animations where used
- Interactive elements: `aria-*` / roles, 48×48px minimum touch targets
- `console.log('[ComponentName]', ...)` for traceable logs

## Adding components

1. Create `ComponentName.jsx` + optional `ComponentName.css` in the appropriate subdirectory
2. JSDoc with `@module` on exports
3. Document new public components in `doc/api-reference.md`
