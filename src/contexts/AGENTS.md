# AGENTS.md — contexts/

## Purpose

React Context providers for global state management.

## Contexts

- `AppContext.jsx` — Triple-Stream state (`activeStream`, `currentModule`, `moduleProgress`)
- `ActivityBankContext.jsx` — Pause/resume, bookmarks, sessions, streak tracking
- `SettingsContext.jsx` — Validated preferences, motion policy and feedback configuration

## State Management Pattern

- Both use `useReducer` for state management
- `AppContext` wraps the entire app (inside BrowserRouter)
- `ActivityBankContext` wraps inside `AppContext`

## Persistence

- ActivityBankContext persists to `localStorage` key: `spin_activity_bank`
- AppContext persists completion, narrative steps and per-module stream choices. Read `../../docs/architecture.md` before changing initialization or resume behavior; streams can write automatic bookmarks when mounted.

## Hooks

- `useApp()` — Access AppContext state and actions
- `useActivityBank()` — Access ActivityBankContext state and actions

## Logging

- `[AppContext]` prefix for stream and module changes
- `[ActivityBank]` prefix for pause, resume, bookmark, persist operations
