# components/

Reusable UI components for Spin, organized into two categories.

## Subdirectories

### `interactive/`
Touch-optimized components for user interaction:
- **InferenceSlider** — Primary slider with glow feedback, ARIA labels, custom formatting
- **MathBlock** — KaTeX LaTeX renderer with collapsible derivation steps
- **PauseButton** — Validates rest, saves bookmark, displays warm messaging
- **RewardAnimation** — "Spin" orbital particle burst for celebrating completions

### `layout/`
Application structure and navigation:
- **AppShell** — Root layout wrapper with content area + bottom nav
- **BottomNav** — Five-tab mobile bottom navigation with animated indicator
- **StreamSwitcher** — Segmented control for Pulse / Vision / Core streams
- **Drawer** — Physics-based slide-up panel (framer-motion spring)

## Design Principles

- Every interactive element has a minimum 48×48px touch target
- All components use design tokens from `styles/design-tokens.css`
- Animation uses `framer-motion` with spring physics (never teleport)
- Each component has a co-located `.css` file for its styles
