# data/

Static data and module registry for Spin.

## Files

### `modules.js`

The centralized module registry defining all 10 Active Inference modules.

**Exports:**
| Export | Type | Description |
| --- | --- | --- |
| `default` | array | All 10 modules |
| `getAllModules()` | function | Returns all modules |
| `getModuleById(id)` | function | Lookup by numeric ID (1-10) |
| `getModuleBySlug(slug)` | function | Lookup by URL slug |
| `getAvailableModules()` | function | Returns only `available: true` modules |

**Module shape (see JSDoc in source):** includes `outcomes`, `glossary` (keys into `glossary.js`), `quiz` (three multiple-choice items), `streams` (structured stream metadata with `summary` / `beats`), `estMinutes`, `difficulty`, and more.

## Adding Data

New data files should follow the same export pattern: default export as array, named exports for lookup functions.
