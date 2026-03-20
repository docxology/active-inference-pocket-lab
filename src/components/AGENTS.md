# AGENTS.md — components/

## Purpose

Reusable UI components for Spin, split into `interactive/` and `layout/`.

## Subdirectories

- `interactive/` — Touch-optimized input components (InferenceSlider, MathBlock, PauseButton, RewardAnimation)
- `layout/` — App structure components (AppShell, BottomNav, StreamSwitcher, Drawer)

## Patterns

- Each component has a co-located `.css` file
- Components use `framer-motion` for physics-based animations
- All interactive elements have `aria-*` attributes and `role` attributes
- Components log state changes via `console.log('[ComponentName]', ...)`

## Adding Components

1. Create `ComponentName.jsx` + `ComponentName.css` in the appropriate subdirectory
2. Export from subdirectory barrel file if applicable
3. Add JSDoc with `@module` tag
4. Ensure 48×48px minimum touch targets for interactive elements
