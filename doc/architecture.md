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

```
<BrowserRouter>
  <SettingsProvider>               ← App preferences
    <AppProvider>                    ← Triple-Stream state
      <ActivityBankProvider>          ← Pause/bookmark state
      <Routes>
        <AppShell>                 ← Layout shell
          <main>
            <Outlet />             ← Active page component
          </main>
          <BottomNav />            ← 5-tab navigation
        </AppShell>
      </Routes>
      </ActivityBankProvider>
    </AppProvider>
  </SettingsProvider>
</BrowserRouter>
```

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
- **Key**: `spin_activity_bank`

## Module Architecture

Each module implements three parallel "stream" components:

```
src/modules/moduleN/
├── PulseStream.jsx   ← "The Enthusiast" (conversational, slider-first)
├── VisionStream.jsx  ← "The Artist" (canvas animation, generative art)
├── CoreStream.jsx    ← "The Academic" (LaTeX equations, sandbox)
└── index.js          ← Barrel export
```

Stream components are registered in `ModulePage.jsx` via the `MODULE_STREAMS` map.

## Build Output

`npm run build` writes versioned chunks and assets under `dist/` (including KaTeX fonts). Sizes change with each release; use `npm run preview` or CI artifacts to inspect the current bundle.
