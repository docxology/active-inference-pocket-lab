# API Reference

Complete props/exports reference for Spin components, contexts, and data.

## Components

### InferenceSlider

**Path**: `src/components/interactive/InferenceSlider.jsx`

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `min` | number | `0` | no | Minimum slider value |
| `max` | number | `100` | no | Maximum slider value |
| `step` | number | `1` | no | Step increment |
| `value` | number | — | no | Controlled value (omit with `defaultValue` for uncontrolled) |
| `defaultValue` | number | `50` | no | Initial value when uncontrolled |
| `onChange` | `(value: number) => void` | — | no | Change callback |
| `label` | string | `'Adjust'` | no | Accessible label (`aria-label` on the range input) |
| `leftLabel` | string | — | no | Left range label text |
| `rightLabel` | string | — | no | Right range label text |
| `unit` | string | `''` | no | Suffix for display value |
| `color` | string | `var(--color-pulse)` | no | Track and glow color |
| `formatValue` | `(value: number) => string` | — | no | Custom value display |

---

### MathBlock

**Path**: `src/components/interactive/MathBlock.jsx`

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `latex` | string | — | **yes** | LaTeX expression to render |
| `label` | string | — | no | Equation label (e.g. "Eq. 1") |
| `description` | string | — | no | Plain-text explanation |
| `steps` | `Array<{ latex: string, note: string }>` | — | no | Derivation steps |

---

### PauseButton

**Path**: `src/components/interactive/PauseButton.jsx`

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `moduleId` | number | — | no | Module ID to bookmark on pause |

---

### RewardAnimation

**Path**: `src/components/interactive/RewardAnimation.jsx`

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `active` | boolean | `false` | no | Whether animation is playing |
| `onComplete` | `() => void` | — | no | Callback when animation ends |
| `message` | string | `"Spin!"` | no | Center celebration text |

---

### StreamSwitcher

**Path**: `src/components/layout/StreamSwitcher.jsx`

No props. Reads `activeStream` from `AppContext` and renders tab bar.

---

### Drawer

**Path**: `src/components/layout/Drawer.jsx`

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `isOpen` | boolean | — | **yes** | Whether drawer is visible |
| `onClose` | `() => void` | — | **yes** | Close callback |
| `title` | string | — | no | Drawer header text |
| `children` | ReactNode | — | no | Drawer content |

---

### Quiz

**Path**: `src/components/interactive/Quiz.jsx`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `questions` | `Array<{ prompt, options, correctIndex, explanation }>` | — | MCQ items (registry shape) |
| `onComplete` | `(score, total) => void` | — | Called after submit |
| `title` | string | `'Retrieval'` | Section `aria-label` |

Requires `ActivityBankProvider` (uses `recordQuiz`).

---

### GlossaryLink

**Path**: `src/components/interactive/GlossaryLink.jsx`

| Prop | Type | Description |
| --- | --- | --- |
| `glossaryKey` | string | Key in `glossary.js` / `modules.js` `glossary` arrays |
| `children` | ReactNode | Optional; defaults to glossary term title |
| `className` | string | Optional CSS class |

Renders `Link` to `/glossary#glossaryKey`.

---

### GlossaryChips

**Path**: `src/components/interactive/GlossaryChips.jsx`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `string[]` | — | Keys to show (invalid keys skipped) |
| `caption` | string | `'Terms'` | Lead-in label |

---

### StreamTemplate

**Path**: `src/components/layout/StreamTemplate.jsx`

| Prop | Type | Description |
| --- | --- | --- |
| `streamKey` | `'pulse' \| 'vision' \| 'core'` | CSS modifier |
| `beats` | `Array<{ id, content, interactive? }>` | Step-through beats |
| `onProgress` | `(fraction: number) => void` | 0..1 progress |
| `onComplete` | `() => void` | Last step continue |
| `finalLabel` | string | Default `'Spin 🌀'` |

---

### ModuleRetrievalQuiz

**Path**: `src/modules/shared/ModuleRetrievalQuiz.jsx`

| Prop | Type | Description |
| --- | --- | --- |
| `moduleId` | number | Loads `getModuleById(moduleId).quiz` |

---

### getCoreRetrievalBeat

**Path**: `src/modules/shared/getCoreRetrievalBeat.jsx`

| Export | Signature | Description |
| --- | --- | --- |
| `getCoreRetrievalBeat` | `(moduleId: number) => StreamBeat` | Final Core beat with heading + `ModuleRetrievalQuiz` |

---

## Contexts

### useApp()

**Path**: `src/contexts/AppContext.jsx`

```js
const {
  activeStream,         // 'pulse' | 'vision' | 'core'
  currentModule,        // number | null
  moduleProgress,       // { [moduleId]: { pulse, vision, core } }
  setStream,            // (stream: string) => void
  setModule,            // (moduleId: number) => void
  updateProgress,       // (moduleId: number, stream: string, progress: number) => void
  getModuleProgress,    // (moduleId: number) => number (0-100 average)
  getOverallProgress,   // () => number (0-100 overall)
} = useApp();
```

**localStorage key**: `spin_module_progress`
**Constants**: `STREAMS.PULSE`, `STREAMS.VISION`, `STREAMS.CORE`

---

### useActivityBank()

**Path**: `src/contexts/ActivityBankContext.jsx`

```js
const {
  isPaused,      // boolean
  pausedAt,      // string | null (ISO timestamp)
  bookmark,      // { moduleId, stream, position } | null
  sessions,      // Array<{ moduleId, stream, minutes, timestamp }>
  totalMinutes,  // number
  currentStreak, // number
  pause,         // () => void
  resume,        // () => void
  setBookmark,   // (moduleId, stream, position) => void
  clearBookmark, // () => void
  recordActivity,// (moduleId, stream, minutes) => void
  recordQuiz,    // (passed: boolean) => void
} = useActivityBank();
```

**localStorage key**: `spin_activity_bank`

---

### useSettings()

**Path**: `src/contexts/SettingsContext.jsx`

```js
const {
  reducedMotion, haptics, sound, highContrast, fontScale,
  defaultStream, autoBookmark, showMathByDefault,
  set,   // (patch: Partial<State>) => void
  reset, // () => void
} = useSettings();
```

**localStorage key**: `spin_settings`

---

## Utilities

### Haptics

**Path**: `src/utils/haptics.js`

Provides safe wrappers around the `navigator.vibrate` API with graceful degradation.

| Export | Signature | Description |
| --- | --- | --- |
| `hapticLight` | `() => void` | 10ms tap (slider interactions) |
| `hapticMedium` | `() => void` | 25ms tap (step advances) |
| `hapticSuccess` | `() => void` | `[20, 50, 20]` pattern (module complete) |
| `hapticReward` | `() => void` | `[30, 50, 30, 50, 50]` pattern (easter egg) |

---

### Logger

**Path**: `src/utils/logger.js`

Structured, prefix-based logging utility with optional history collection.

| Export | Signature | Description |
| --- | --- | --- |
| `createLogger` | `(prefix: string) => Logger` | Returns logger instance `[Prefix]` |
| `configureLogger` | `(options: { level, collect }) => void` | Set global level/collection |
| `getLogHistory` | `() => Array` | Retrieve collected logs |
| `clearLogHistory` | `() => void` | Clear collected logs |

Usage: `const log = createLogger('PulseStream'); log.debug('step', 1);`

---

## Data Layer

### modules.js

**Path**: `src/data/modules.js`

| Export | Signature | Description |
| --- | --- | --- |
| `default` | `Module[]` | All 10 modules |
| `getAllModules()` | `() => Module[]` | Returns all modules |
| `getModuleById(id)` | `(id: number \| string) => Module` | Lookup by ID |
| `getModuleBySlug(slug)` | `(slug: string) => Module` | Lookup by URL slug |
| `getAvailableModules()` | `() => Module[]` | Only `available: true` modules |

Each **`Module`** includes at least: `id`, `slug`, `title`, `subtitle`, `description`, `icon`, `firstAction`, `glossary` (string keys), `quiz` (three `QuizItem`s), `streams`, `available`, and related metadata (see JSDoc in source).

---

### glossary.js

**Path**: `src/data/glossary.js`

| Export | Signature | Description |
| --- | --- | --- |
| `default` | `Record<string, GlossaryEntry>` | Raw term map |
| `getGlossaryEntry(key)` | `(key: string) => GlossaryEntry \| undefined` | Single term |
| `getAllGlossary()` | `() => Array<{ key, ...GlossaryEntry }>` | Flattened rows for UI |
| `searchGlossary(query)` | `(query: string) => Array` | Empty query: same rows as `getAllGlossary()`; else filter by term/short/formal |
