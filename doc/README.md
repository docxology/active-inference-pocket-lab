# doc/

Comprehensive documentation for Spin — The Active Inference Pocket Lab.

## The Seed

> This project began with a single creative brief. The document [**initial-pocket-lab-prompt.md**](initial-pocket-lab-prompt.md) is the original seed from which every architectural decision, design token, and interaction pattern in Spin was grown. It defines the constitutional narrative ("the Vibe"), the 6 core rules, the Triple-Stream Architecture ("the Helix"), and the mandate for Module 1: The First Orbit. **Do not edit the body of this file** — it is the read-only founding document. Current product behavior (all 10 modules, registry quiz and glossary, PWA) is described in [modules-guide.md](modules-guide.md), [architecture.md](architecture.md), and the root [README.md](../README.md).

## Contents

| Document | Description |
| --- | --- |
| [initial-pocket-lab-prompt.md](initial-pocket-lab-prompt.md) | The Seed — Janna's original creative brief (read-only) |
| [philosophy.md](philosophy.md) | The 6 constitutional rules with implementation mapping |
| [architecture.md](architecture.md) | System architecture, providers, routes, lazy module streams, data flow |
| [design-system.md](design-system.md) | Design tokens, color palette, typography, spacing, accessibility |
| [modules-guide.md](modules-guide.md) | Module structure, registry (`quiz`, `glossary`), stream specs, expansion |
| [api-reference.md](api-reference.md) | Component props, context APIs, data layer exports |
| [testing.md](testing.md) | Test strategy, inventory (counts from `vitest run`), adding tests |
| [configuration.md](configuration.md) | Vite config, environment, build, deployment, PWA |
| [logging.md](logging.md) | Logging conventions, component prefixes |

**Registry integration** (quiz questions + glossary keys per module, deep links to `/glossary#key`) is specified in [modules-guide.md](modules-guide.md) and reflected in code under `src/data/modules.js` and `src/data/glossary.js`.

## Reading Order

For newcomers:

1. **[initial-pocket-lab-prompt.md](initial-pocket-lab-prompt.md)** — Understand the *why* (immutable)
2. **[philosophy.md](philosophy.md)** — See how the seed became rules
3. **[architecture.md](architecture.md)** — Understand the *how*
4. **[modules-guide.md](modules-guide.md)** — Understand the *what* (all 10 modules, streams, quality bar)

Then [design-system.md](design-system.md), [api-reference.md](api-reference.md), [testing.md](testing.md), and others as needed.

## Quick Links

- **Getting Started**: root [README.md](../README.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Agent context (repo root)**: [AGENTS.md](../AGENTS.md)
