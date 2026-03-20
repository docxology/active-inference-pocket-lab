# AGENTS.md — contexts/

## Purpose
React Context providers for global state management.

## Contexts
- `AppContext.jsx` — Triple-Stream state (`activeStream`, `currentModule`, `moduleProgress`)
- `ActivityBankContext.jsx` — Pause/resume, bookmarks, sessions, streak tracking

## State Management Pattern
- Both use `useReducer` for state management
- `AppContext` wraps the entire app (inside BrowserRouter)
- `ActivityBankContext` wraps inside `AppContext`

## Persistence
- ActivityBankContext persists to `localStorage` key: `spin_activity_bank`
- AppContext is ephemeral (module progress resets on reload — TODO: persist)

## Hooks
- `useApp()` — Access AppContext state and actions
- `useActivityBank()` — Access ActivityBankContext state and actions

## Logging
- `[AppContext]` prefix for stream and module changes
- `[ActivityBank]` prefix for pause, resume, bookmark, persist operations
