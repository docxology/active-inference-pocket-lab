# AGENTS.md — utils/

## Purpose

Shared utility modules: haptic feedback and structured logging.

## Files

- `haptics.js` — Vibration API with graceful degradation, 4 patterns (light/medium/success/reward)
- `logger.js` — Configurable log levels (debug/info/warn/error), component prefixes, optional log collection

## Usage

- Import `hapticLight`, `hapticMedium`, etc. from `utils/haptics`
- Import `createLogger` from `utils/logger` for component-scoped logging
