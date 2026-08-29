# Design System

Spin's visual language, defined through CSS custom properties in `src/styles/design-tokens.css`.

## Color Palette

### Background
| Token | Value | Usage |
| --- | --- | --- |
| `--color-bg-primary` | `#0D0F14` | Main background |
| `--color-bg-secondary` | `#161921` | Card backgrounds |
| `--color-bg-tertiary` | `#1E2233` | Elevated surfaces |
| `--color-bg-elevated` | `#232839` | Highest elevation |

### Stream Colors
| Stream | Token | Value | Glow |
| --- | --- | --- | --- |
| Pulse | `--color-pulse` | `#FF6B6B` | `rgba(255, 107, 107, 0.3)` |
| Vision | `--color-vision` | `#7C6BFF` | `rgba(124, 107, 255, 0.3)` |
| Core | `--color-core` | `#4ECDC4` | `rgba(78, 205, 196, 0.3)` |
| Hearth | `--color-hearth` | `#FFB86B` | `rgba(255, 184, 107, 0.3)` |
| Pause | `--color-pause` | `#B8A9E8` | — |

### Text
| Token | Value | Usage |
| --- | --- | --- |
| `--color-text-primary` | `#F0ECE2` | Headings, emphasis |
| `--color-text-secondary` | `#B8B0A0` | Body text |
| `--color-text-muted` | `#7A7468` | Labels, hints |
| `--color-text-inverse` | `#0D0F14` | Text on light backgrounds |

### Semantic
| Token | Value | Usage |
| --- | --- | --- |
| `--color-success` | `#4ECDC4` | Positive feedback |
| `--color-warning` | `#FFB86B` | Caution |
| `--color-error` | `#FF6B6B` | Error / high surprise |
| `--color-accent` | `#FFB86B` | Call-to-action accent |

## Typography

### Font Families
| Token | Family | Usage |
| --- | --- | --- |
| `--font-family-body` | Inter | Body text, paragraphs |
| `--font-family-display` | Outfit | Headings, buttons, labels |
| `--font-family-mono` | JetBrains Mono | Code, metrics, counters |

### Font Sizes
| Token | Size | Usage |
| --- | --- | --- |
| `--font-size-xs` | 0.75rem (12px) | Labels, captions |
| `--font-size-sm` | 0.875rem (14px) | Secondary text |
| `--font-size-base` | 1rem (16px) | Body text |
| `--font-size-lg` | 1.125rem (18px) | Large body |
| `--font-size-xl` | 1.25rem (20px) | Section headings |
| `--font-size-2xl` | 1.5rem (24px) | Page headings |
| `--font-size-3xl` | 2rem (32px) | Hero headings |
| `--font-size-4xl` | 2.5rem (40px) | Display text |

### Font Weights
| Token | Weight |
| --- | --- |
| `--font-weight-regular` | 400 |
| `--font-weight-medium` | 500 |
| `--font-weight-semibold` | 600 |
| `--font-weight-bold` | 700 |

## Spacing (8px grid)

| Token | Value | px |
| --- | --- | --- |
| `--space-1` | 0.25rem | 4 |
| `--space-2` | 0.5rem | 8 |
| `--space-3` | 0.75rem | 12 |
| `--space-4` | 1rem | 16 |
| `--space-5` | 1.5rem | 24 |
| `--space-6` | 2rem | 32 |
| `--space-8` | 3rem | 48 |
| `--space-10` | 4rem | 64 |
| `--space-12` | 6rem | 96 |

## Touch Targets

| Token | Size | Usage |
| --- | --- | --- |
| `--touch-target-min` | 48px | Minimum for any interactive element |
| `--touch-target-comfortable` | 56px | Recommended for primary buttons |

## Border Radius

| Token | Value |
| --- | --- |
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-full` | 9999px |

## Gradients

| Token | Colors |
| --- | --- |
| `--gradient-pulse` | Pulse red to warm orange |
| `--gradient-vision` | Vision purple to blue |
| `--gradient-core` | Core teal to cyan |
| `--gradient-spin` | Full spectrum (pulse → vision → core → hearth) |

## Glassmorphism

The `.glass` utility class provides:
```css
background: rgba(30, 34, 51, 0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.05);
border-radius: var(--radius-lg);
```

## Animations

| Name | Duration | Usage |
| --- | --- | --- |
| `fadeIn` | 0.3s | Content entrance |
| `spin` | 8s | Logo rotation |
| `pulse` | 2s | Breathing glow |
| `breathe` | 4s | Slow scale pulsation |

All animations respect `prefers-reduced-motion: reduce`.

## Accessibility

Checklist (aligned with [philosophy.md](philosophy.md) Rule 1 and [Settings](../src/contexts/SettingsContext.jsx)):

- **Touch**: Minimum `--touch-target-min` (48px) on controls; larger for primary actions where possible.
- **Contrast**: Text uses `--color-text-primary` / `--color-text-secondary` on dark surfaces; favor semantic tokens over ad hoc hex in components.
- **Focus**: Interactive elements should show visible focus styles (`:focus-visible`); glossary links use outlined focus in `GlossaryLink.css`.
- **Motion**: `prefers-reduced-motion: reduce` is respected for CSS animations; learners can also set **reduced motion** in Settings (sets `data-reduced-motion` on `<html>` for app-wide behavior).
- **Semantics**: Prefer `button` / landmarks / `aria-label` on sliders and stream tabs; Pulse/Vision steppers expose progress as tabs where applicable.
- **Live regions**: Use `aria-live` sparingly for values that update during interaction (e.g. counters), not for static copy.

Ongoing: run a dedicated screen-reader and keyboard pass as releases mature (tracked in root README TODO).
