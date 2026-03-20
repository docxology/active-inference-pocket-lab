# module1/ — The First Orbit

Module 1: Active Inference overview / introduction.

## Streams

### 💓 PulseStream (`PulseStream.jsx`)
3-step conversational micro-inference:
1. "What if your brain is a prediction machine?" — Set a prior belief via slider
2. "You just made a prediction." — Learn about priors
3. "That gap? That's surprise." — The engine of learning

**Features:** Interactive prior slider, real-time surprise meter, step progress dots, continue button gating.

### ✨ VisionStream (`VisionStream.jsx`)
Generative art canvas with orbiting particles ("The Variable Hearth"):
- **Prior Strength** slider controls orbit radius and speed
- **Precision** slider controls particle wobble and connection visibility
- Exploration threshold triggers "Spin" reward at 10+ interactions

**Features:** Canvas animation loop, DPR-aware rendering, fade trails.

### 🔬 CoreStream (`CoreStream.jsx`)
Academic derivation of variational free energy:
- Main equation: `F = D_KL[q(s) || p(s|o)] + (-ln p(o))`
- 5-step derivation with LaTeX + notes
- Live sandbox (in drawer) with 3 sliders computing metrics in real-time

**Features:** KaTeX rendering, collapsible derivation steps, computed `surprise`, `KL`, `freeEnergy`.

## Files

| File | Size | Description |
| --- | --- | --- |
| `PulseStream.jsx` | ~4KB | 3-step micro-inference experience |
| `PulseStream.css` | ~3KB | Pulse stream styles |
| `VisionStream.jsx` | ~5KB | Canvas generative art experience |
| `VisionStream.css` | ~2KB | Vision stream styles |
| `CoreStream.jsx` | ~6KB | LaTeX equations + sandbox |
| `CoreStream.css` | ~2KB | Core stream styles |
| `index.js` | ~0.2KB | Barrel export |
