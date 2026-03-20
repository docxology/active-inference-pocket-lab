# styles/

Design token system and global CSS for Spin.

## Files

### `design-tokens.css`
Comprehensive CSS custom properties defining the visual language:

| Token Category | Examples | Count |
| --- | --- | --- |
| Colors | `--color-bg-primary`, `--color-pulse`, `--color-text-primary` | ~30 |
| Typography | `--font-family-body`, `--font-size-xl`, `--font-weight-bold` | ~15 |
| Spacing | `--space-1` through `--space-12` (8px grid) | 12 |
| Borders | `--radius-sm` through `--radius-full` | 5 |
| Gradients | `--gradient-pulse`, `--gradient-vision`, `--gradient-core`, `--gradient-spin` | 4 |
| Touch targets | `--touch-target-min` (48px), `--touch-target-comfortable` (56px) | 2 |
| Transitions | `--transition-fast`, `--transition-normal`, `--transition-slow` | 3 |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg` | 3 |
| Layout | `--nav-height`, `--max-width-content` | 2 |

### `global.css`
Global stylesheet imported by `main.jsx`:
- CSS reset (box-sizing, margins)
- Base typography (Google Fonts: Inter, Outfit, JetBrains Mono)
- Utility classes (`.glass`, `.container`, `.text-label`)
- Stream accent variable switching (`.stream-pulse`, `.stream-vision`, `.stream-core`)
- Keyframe animations (`fadeIn`, `spin`, `pulse`, `breathe`)
- `prefers-reduced-motion` media query
- Mobile-first responsive breakpoints (480px, 768px)

## Usage Rules

1. **Never** use inline colors/sizes — always reference `var(--token-name)`
2. **All** gradients come from design tokens
3. **Touch targets** must be ≥ `var(--touch-target-min)` (48px)
4. **Font families** use the three-family system (body/display/mono)
