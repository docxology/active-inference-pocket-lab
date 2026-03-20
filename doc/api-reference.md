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
| `value` | number | `50` | no | Current value |
| `onChange` | `(value: number) => void` | — | no | Change callback |
| `label` | string | — | **yes** | Accessible label (renders as `aria-label`) |
| `leftLabel` | string | — | no | Left range label text |
| `rightLabel` | string | — | no | Right range label text |
| `unit` | string | — | no | Suffix for display value |
| `color` | string | `var(--color-accent)` | no | Track and glow color |
| `formatValue` | `(value: number) => string` | — | no | Custom value formatter |

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

## Contexts

### useApp()

**Path**: `src/contexts/AppContext.jsx`

```js
const {
  activeStream,    // 'pulse' | 'vision' | 'core'
  currentModule,   // number | null
  moduleProgress,  // { [moduleId]: { pulse, vision, core } }
  setStream,       // (stream: string) => void
  setModule,       // (moduleId: number) => void
  updateProgress,  // (moduleId: number, stream: string, progress: number) => void
} = useApp();
```

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
} = useActivityBank();
```

**localStorage key**: `spin_activity_bank`

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
