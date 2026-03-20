# contexts/

React Context providers for global application state.

## Contexts

### AppContext (`AppContext.jsx`)

Manages the Triple-Stream Architecture state and module progress.

**State:**
| Field | Type | Description |
| --- | --- | --- |
| `activeStream` | `'pulse' \| 'vision' \| 'core'` | Currently selected stream |
| `currentModule` | `number \| null` | Active module ID |
| `moduleProgress` | `object` | Per-module, per-stream progress (0-100) |

**Actions:**
| Function | Parameters | Description |
| --- | --- | --- |
| `setStream(stream)` | string | Switch active stream |
| `setModule(moduleId)` | number | Set current module |
| `updateProgress(moduleId, stream, progress)` | number, string, number | Update stream progress |

**Exported Constants:**
- `STREAMS` — `{ PULSE: 'pulse', VISION: 'vision', CORE: 'core' }`

### ActivityBankContext (`ActivityBankContext.jsx`)

Manages the "Seasonal Rhythms" philosophy — pause, resume, bookmarks, session tracking.

**State:**
| Field | Type | Description |
| --- | --- | --- |
| `isPaused` | boolean | Whether the user is in "planned pause" |
| `pausedAt` | string \| null | ISO timestamp of pause start |
| `bookmark` | object \| null | `{ moduleId, stream, position }` |
| `sessions` | array | Completed session records |
| `totalMinutes` | number | Cumulative active minutes |
| `currentStreak` | number | Consecutive day streak |

**Actions:**
| Function | Parameters | Description |
| --- | --- | --- |
| `pause()` | — | Enter planned pause mode |
| `resume()` | — | Exit pause mode |
| `setBookmark(moduleId, stream, position)` | number, string, string | Save current position |
| `clearBookmark()` | — | Remove bookmark |
| `recordActivity(moduleId, stream, minutes)` | number, string, number | Log activity session |

**Persistence:** All state persists to `localStorage` under key `spin_activity_bank`.
