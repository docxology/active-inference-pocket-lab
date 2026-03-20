# Contributing to Spin

Thank you for contributing to the Active Inference Pocket Lab!

## Development Setup

```bash
git clone <repo-url>
npm install
npm run dev
```

## Project Structure

See [README.md](README.md) for the full architecture overview.

## Adding a New Module

1. Create a directory: `src/modules/moduleN/`
2. Implement three stream components:
   - `PulseStream.jsx` — Conversational, high-emotion, micro-inference path
   - `VisionStream.jsx` — Interactive animation and generative art
   - `CoreStream.jsx` — Academic, LaTeX equations, sandbox
3. Create an `index.js` barrel export
4. Register the stream components in `src/pages/ModulePage.jsx` → `MODULE_STREAMS`
5. Set `available: true` in `src/data/modules.js`

### Module Requirements

- **The First Threshold**: Every module MUST start with a physical action (slider, drag, or tilt). No walls of text.
- **Pulse**: Keep language conversational. No jargon without context. Target 2-minute micro-inferences.
- **Vision**: Canvas or SVG animation. Must respond to at least one slider in real-time.
- **Core**: LaTeX equations via the `MathBlock` component. Include derivation steps.

## Code Style

- Run `npm run format` before committing
- All components must have JSDoc documentation
- Follow the existing CSS design token system (no inline colors/sizes)
- Console logs for state changes use `[ComponentName]` prefix

## Testing

```bash
npm test           # Run tests
npm run test:watch # Watch mode
```

- Tests use real methods (no mocks)
- Use `@testing-library/react` for component tests
- Place tests in `src/__tests__/`

## The Founding Document

Before contributing, please read [**The Seed**](doc/initial-pocket-lab-prompt.md) — the original creative brief that defines Spin's constitutional narrative, core philosophy, and architectural vision. This document is preserved exactly as-written and serves as the ultimate reference for design decisions. Every contribution should be consistent with the spirit and rules laid out in the Seed.

For the complete philosophy breakdown with implementation details, see [doc/philosophy.md](doc/philosophy.md).

## Philosophy Reminders

- **Aggressive Generosity**: When in doubt, make it bigger and more breathable
- **No Penalties**: Never punish users for pausing or taking breaks
- **Visible Pathing**: Never hide requirements behind vague thresholds
- **Warmth Over Competition**: Celebrate clarity and good questions, not speed
