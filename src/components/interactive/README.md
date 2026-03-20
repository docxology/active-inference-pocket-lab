# interactive/

Touch-optimized interactive components for Active Inference learning.

## Components

| Component | File | Purpose |
| --- | --- | --- |
| InferenceSlider | `InferenceSlider.jsx` | Accessible range slider with glow feedback, custom formatting, ARIA |
| MathBlock | `MathBlock.jsx` | KaTeX LaTeX renderer with collapsible derivation steps |
| PauseButton | `PauseButton.jsx` | Validates rest, saves bookmark to ActivityBankContext |
| RewardAnimation | `RewardAnimation.jsx` | "Spin" particle burst celebrating module completions |

## File Structure

Each component follows the pattern:
```
ComponentName.jsx    — React component with JSDoc
ComponentName.css    — Co-located styles using design tokens
```

## Props API

### InferenceSlider
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | number | 0 | Minimum value |
| `max` | number | 100 | Maximum value |
| `value` | number | 50 | Current value |
| `onChange` | function | — | Callback with new value |
| `label` | string | — | Accessible label (required) |
| `leftLabel` | string | — | Left range label |
| `rightLabel` | string | — | Right range label |
| `unit` | string | — | Display unit suffix |
| `color` | string | accent | Track/glow color |
| `formatValue` | function | — | Custom value display formatter |

### MathBlock
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `latex` | string | — | LaTeX expression (required) |
| `label` | string | — | Equation label (e.g. "Eq. 1") |
| `description` | string | — | Plain-text explanation |
| `steps` | array | — | Derivation steps `[{ latex, note }]` |

### PauseButton
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `moduleId` | number | — | Module to bookmark |

### RewardAnimation
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `active` | boolean | false | Whether to show the animation |
| `onComplete` | function | — | Callback when animation finishes |
| `message` | string | "Spin!" | Celebration text |
