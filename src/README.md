# src/

Source directory for the Spin Active Inference Pocket Lab.

## Directory Structure

| Directory | Purpose |
| --- | --- |
| `components/` | Reusable UI components (interactive elements + layout shells) |
| `contexts/` | React Context providers for global state management |
| `data/` | Static data and module registry |
| `modules/` | Per-module stream implementations (Pulse / Vision / Core) |
| `pages/` | Route-level page components |
| `styles/` | Design token system and global CSS |
| `test/` | Test setup and configuration |
| `__tests__/` | Unit and integration test files |
| `assets/` | Static assets (images, fonts) |

## Entry Points

- **`main.jsx`** — Application entry point; mounts React and imports global styles
- **`App.jsx`** — Root component with React Router and context providers

## Key Patterns

- All exported functions/components use JSDoc documentation
- Console logs use `[ComponentName]` prefix for traceability
- CSS uses design tokens from `styles/design-tokens.css` (never inline values)
- Touch targets minimum 48×48px per accessibility standards
