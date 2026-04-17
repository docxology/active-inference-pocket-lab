# Design Philosophy

The 6 constitutional rules of Spin — The Active Inference Pocket Lab.

## The Constitutional Narrative

> "You are an architect of a world in formation. Our current digital spaces for learning are
> often 'Linear Voids' — dense, passive, and exclusionary. We are building a sanctuary for
> Active Inference called 'Spin'.
>
> In this space, the primary value is Participation and Harmonious Movement. We prioritize
> the user's energy as a finite, sacred mineral. Your goal is to transform the 'Passive Lecture'
> into an 'Active Laboratory' where the user learns by doing, moving, and adjusting variables
> in a mobile-first, browser-based environment."

---

## Rule 1: Aggressive Generosity

> Use large touch targets and breathable typography. Never worship information density.
> If a concept is complex, break it into a path of 1 to 15 singular ideas.

**Implementation:**
- Minimum 48×48px touch targets (`--touch-target-min`)
- Generous spacing on 8px grid (`--space-1` through `--space-12`)
- Maximum 3 sentences per screen in Pulse streams
- `--font-size-lg` (18px) for body text, never smaller than 14px
- **Epistemic generosity**: Glossary links and end-of-module retrieval quizzes make uncertainty and recall explicit; learners see *what* to know and *how* to check themselves, without shame or speed pressure.

---

## Rule 2: The Physics of the Drawer

> No teleporting. All changes in view should have spatial reality.
> Use sliders, drawers, and carousels — never hard jumps.

**Implementation:**
- `Drawer` component uses `framer-motion` spring physics
- `StreamSwitcher` has animated sliding indicator
- Page transitions use `motion.div` with spring stiffness/damping
- `RewardAnimation` uses orbiting particles with real physics

---

## Rule 3: Seasonal Rhythms (Activity Banking)

> Implement Planned Pauses and Hibernate Mode. Users can pause without penalty.
> Track sessions and streaks, but never punish breaks.

**Implementation:**
- `ActivityBankContext` with `pause()`, `resume()`, `setBookmark()`
- `PausePage` validates rest: "Rest is not stopping"
- `PauseButton` available on every module page
- `currentStreak` tracked but breaks don't reset progress

---

## Rule 4: The First Threshold

> Every module starts with a physical action — not text.
> The first thing the user does is move, drag, or tap.

**Implementation:**
- Module 1 Pulse: slider appears before any explanation
- Module data includes `firstAction` field describing the threshold
- Content is gated behind interaction (`hasInteracted` state)

---

## Rule 5: The Hearth (Not the Arena)

> Replace leaderboards with the Hearth. Celebrate clarity and support,
> not speed. Award "Good Questions" and consistency.

**Implementation:**
- `HearthPage` shows session stats, clarity badges, good questions
- No competitive ranking or time-based scoring
- Badges reward consistency (streak) and engagement (minutes)
- Future: shared "Good Questions" community feature

---

## Rule 6: Visible Pathing

> Show the complete map. Every user sees exactly what is required to reach
> the next proficiency level. No hidden gates.

**Implementation:**
- `ProficiencyMapPage` shows all 10 modules × 3 streams in grid
- Progress bars per stream, visible at all times
- Module list and cards reflect shipped status — all 10 modules are implemented with `available: true` in `modules.js`
- Module cards show percentage completion

---

## Joy (without scoreboards)

Delight here is **participation-forward**: springs and haptics that acknowledge a gesture, a “Spin” moment that celebrates exploration, and language that stays warm. It is not leaderboard adrenaline—learners are not ranked on speed or streaks as the primary identity of the app.
