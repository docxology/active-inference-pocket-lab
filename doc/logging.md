# Logging

Logging conventions and component prefixes for Spin.

## Convention

All console logs use a **bracketed component prefix** for traceability:

```js
console.log('[ComponentName] Message', data);
```

This convention enables:
- Quick identification of log sources in browser DevTools
- Filtering logs by component name
- Understanding state change flow across the app

## Component Log Prefixes

| Component | Prefix | Example Events |
| --- | --- | --- |
| AppContext | `[AppContext]` | Stream switched, module set, progress updated |
| ActivityBank | `[ActivityBank]` | Pause, resume, bookmark set/clear, persist, restore |
| PulseStream | `[PulseStream]` | First interaction, step advance, module complete |
| VisionStream | `[VisionStream]` | Exploration threshold reached |
| CoreStream | `[CoreStream]` | Sandbox explored |
| InferenceSlider | `[InferenceSlider]` | Value change (label + value) |
| ModulePage | `[ModulePage]` | Module entered (ID + title) |

## State Change Logging

### AppContext
```
[AppContext] Stream switched to: vision
[AppContext] Module set to: 1
[AppContext] Progress updated: module=1, stream=pulse, progress=100
```

### ActivityBankContext
```
[ActivityBank] Restored persisted state { sessionCount: 2, isPaused: false }
[ActivityBank] User pausing — bookmarking state
[ActivityBank] User resuming from pause
[ActivityBank] Bookmark set: { moduleId: 1, stream: 'pulse', position: 'step-2' }
[ActivityBank] Activity recorded: module=1, stream=pulse, minutes=5
[ActivityBank] Failed to load persisted state: <error>
[ActivityBank] Failed to persist state: <error>
```

### Module Streams
```
[PulseStream] First interaction — threshold crossed
[PulseStream] Advanced to step 2
[PulseStream] Module 1 Pulse complete!
[VisionStream] Exploration threshold reached — reward!
[CoreStream] User explored the sandbox
```

### Components
```
[InferenceSlider] "Prior Belief" → 73
[ModulePage] Entered Module 1: The First Orbit
```

## Error Handling

Context providers use try/catch around localStorage operations:
```js
try {
  localStorage.setItem('spin_activity_bank', JSON.stringify(state));
} catch (error) {
  console.error('[ActivityBank] Failed to persist state:', error);
}
```

## Adding Logging

When creating new components:
1. Use the `[ComponentName]` prefix consistently
2. Log state changes, user interactions, and error boundaries
3. Log at appropriate levels:
   - `console.log` — State changes, user interactions
   - `console.warn` — Recoverable issues
   - `console.error` — Failures, caught exceptions
