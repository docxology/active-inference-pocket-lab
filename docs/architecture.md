# Architecture

Spin's system architecture for the Active Inference Pocket Lab.

## Technology Stack

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| Framework | React | 19 | Component-based UI |
| Build | Vite | 8 | Fast dev server + build |
| Routing | React Router | 7 | Client-side navigation |
| Animation | Framer Motion | — | Physics-based spring animations |
| Math | KaTeX | — | Client-side LaTeX rendering |
| Testing | Vitest | 4 | Unit + integration tests |
| Testing | Testing Library | — | Component render + query |

## Component Hierarchy

Matches [`src/App.jsx`](../src/App.jsx):

```
<BrowserRouter>
  <SettingsProvider>            ← preferences (useSettings), CSS vars on <html>
    <AppProvider>                 ← streams + module progress
      <ActivityBankProvider>       ← pause, bookmark, sessions, quiz flags
        <Routes>                   ← most routes use React.lazy + Suspense
          <Route element={<AppShell />}>  … pages …
        </Routes>
      </ActivityBankProvider>
    </AppProvider>
  </SettingsProvider>
</BrowserRouter>
```

`AppShell` wraps `<Outlet />`, `TopBar`, `BottomNav`, and stream UI. `HomePage` is eager; other pages load via `React.lazy` with `RouteFallback` (reduced-motion-safe).

## Data Flow

```
                    ┌──────────────┐
                    │  AppContext   │
                    │ activeStream │
                    │ moduleProgress│
                    └──────┬───────┘
                           │ provides
                    ┌──────┴───────┐
                    │ActivityBank  │
                    │ isPaused     │
                    │ bookmark     │
                    │ sessions     │
                    └──────┬───────┘
                           │ provides
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
    │  Pages    │   │ Modules   │   │ Components│
    │ (routes)  │   │ (streams) │   │ (shared)  │
    └───────────┘   └───────────┘   └───────────┘
```

## Route Map

| Path | Component | Description |
| --- | --- | --- |
| `/` | HomePage | Landing with hero, resume, stats |
| `/modules` | ModuleListPage | All 10 module cards |
| `/modules/:moduleId` | ModulePage | Active module with stream switcher |
| `/map` | ProficiencyMapPage | Visual progress grid |
| `/hearth` | HearthPage | Community celebration |
| `/pause` | PausePage | Planned pause / hibernate |
| `/glossary` | GlossaryPage | Term lookup |
| `/search` | SearchPage | In-app search |
| `/settings` | SettingsPage | User preferences |
| `*` | NotFoundPage | Unknown paths |

## State Management

### AppContext (persisted to localStorage)
- `activeStream` — `'pulse' | 'vision' | 'core'`
- `currentModule` — active module ID
- `moduleProgress` — `{ [moduleId]: { pulse: 0-100, vision: 0-100, core: 0-100 } }`
- Computed: `getModuleProgress()`, `getOverallProgress()`
- **Key**: `spin_module_progress`

### ActivityBankContext (persisted to localStorage)
- `isPaused` — boolean
- `bookmark` — `{ moduleId, stream, position } | null`
- `sessions` — activity records array
- `totalMinutes` — cumulative active time
- `currentStreak` — consecutive day count
- Quiz completion recording where applicable
- **Key**: `spin_activity_bank`

### SettingsContext (persisted to localStorage)

**Path**: `src/contexts/SettingsContext.jsx`

- `reducedMotion`, `haptics`, `sound`, `highContrast`, `fontScale`, `defaultStream`, `autoBookmark`, `showMathByDefault`
- `set(patch)`, `reset()`
- Applies `--font-scale` and `data-*` attributes on `document.documentElement`
- **Key**: `spin_settings`

## Module Architecture

Each module implements three parallel "stream" components:

```
src/modules/moduleN/
├── PulseStream.jsx   ← "The Enthusiast" (conversational, slider-first)
├── VisionStream.jsx  ← "The Artist" (canvas animation, generative art)
├── CoreStream.jsx    ← "The Academic" (LaTeX equations, sandbox)
└── index.js          ← Barrel export
```

Stream components are registered in `ModulePage.jsx` via the `MODULE_STREAMS` map (keys `1`–`10`), each value a `React.lazy(() => import(...))` for the module’s barrel export.

### Registry-driven content

- **`src/data/modules.js`** — Each module includes `quiz` (three MCQs) and `glossary` (string keys).
- **Core streams** — Final beat uses `getCoreRetrievalBeat` / `ModuleRetrievalQuiz` to render `Quiz` from the registry.
- **`src/data/glossary.js`** — Definitions and `getGlossaryEntry` / `getAllGlossary` / `searchGlossary`.
- **Glossary page** — Entries render with `id={key}` so `/glossary#key` scrolls correctly; `GlossaryLink` targets those hashes.

## Build Output

`npm run build` writes versioned chunks and assets under `dist/` (including KaTeX fonts). Sizes change with each release; use `npm run preview` or CI artifacts to inspect the current bundle.


## Learning continuity and accessibility

Providers initialize storage when mounted, validate legacy JSON by field, and report storage errors while keeping the in-memory lab usable. Completion percentages are monotonic; step positions and last selected streams are stored separately, so revisiting material does not erase earned completion. `useLearningPosition` restores a bounded step index and honors automatic bookmarks. Explicit pause always saves the current step; resume restores the saved stream and clears pause state. Sliders and simulation parameters restart when their stream remounts; bookmarks preserve the narrative step rather than every sandbox variable.

`useStreamProgress` records measured time while the stream is mounted, visible and unpaused, once per completion. Estimates in the catalog remain planning estimates. Reduced motion, visibility and pause state suspend continuous canvas/SVG animations through `useAnimationEnabled`; manual grid steps remain available.

`AppShell` provides a skip link, route focus/scroll restoration, route error recovery, and `PwaStatus`. Stream tabs support arrow keys/Home/End. Drawers are portaled above navigation, isolate the app with `inert`, contain keyboard focus, close on Escape, lock scrolling, and return focus to the opener. Scrollable equations are keyboard focusable.

The Gaussian utility computes the full expected log likelihood, including posterior variance. Module 1 uses an explicit Gaussian generative model and posterior KL gap. DataFitter and GridWorld identify their simplified scoring rules rather than presenting them as marginal evidence or full POMDP inference.
