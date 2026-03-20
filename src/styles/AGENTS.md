# AGENTS.md — styles/

## Purpose

Design token system and global CSS for Spin.

## Files

- `design-tokens.css` — CSS custom properties (colors, typography, spacing, gradients, shadows)
- `global.css` — Reset, typography, utilities, animations, responsive breakpoints

## Rules

- Never inline colors/sizes — always use `var(--token-name)`
- Touch targets ≥ 48px (`--touch-target-min`)
- Three font families: `--font-family-body` (Inter), `--font-family-display` (Outfit), `--font-family-mono` (JetBrains Mono)
- 8px spacing grid (`--space-1` = 4px, `--space-2` = 8px, etc.)

## Stream Colors

- Pulse: `--color-pulse` (#FF6B6B)
- Vision: `--color-vision` (#7C6BFF)
- Core: `--color-core` (#4ECDC4)
- Hearth: `--color-hearth` (#FFB86B)
- Pause: `--color-pause` (#B8A9E8)

## Adding Tokens

Add new tokens to `design-tokens.css` inside the `:root` block. Use consistent naming: `--category-variant`.
