# utils/

Shared utility modules for Spin.

## Modules

| Module | File | Purpose |
| --- | --- | --- |
| Haptics | `haptics.js` | Vibration API wrapper with 4 intensity patterns |
| Logger | `logger.js` | Configurable structured logging with component prefixes |

## Haptic Patterns

| Function | Duration | Use Case |
| --- | --- | --- |
| `hapticLight()` | 10ms | Slider change, button press |
| `hapticMedium()` | 25ms | Step advance, stream switch |
| `hapticSuccess()` | 5-pulse | Module completion |
| `hapticReward()` | 7-pulse | Spin animation celebration |

## Logger API

```js
import { createLogger } from '../utils/logger';
const log = createLogger('MyComponent');
log.info('Started');
log.warn('Low precision', { value: 5 });
log.error('Failed to load', error);
```
