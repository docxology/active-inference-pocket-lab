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

**Module Shape:**
```js
{
  id: number,         // 1-10
  slug: string,       // URL-safe identifier
  title: string,      // Display title
  subtitle: string,   // Chapter reference
  description: string,// Brief content description
  icon: string,       // Emoji icon
  color: string,      // CSS custom property name
  available: boolean, // Module implemented?
  firstAction: string,// "The First Threshold" description
  streams: {
    pulse: string,    // Pulse stream description
    vision: string,   // Vision stream description
    core: string,     // Core stream description
  }
}
```

## Adding Data

New data files should follow the same export pattern: default export as array, named exports for lookup functions.
