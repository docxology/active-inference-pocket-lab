# layout/

Application layout and navigation components.

## Components

| Component      | File                 | Purpose                                                          |
| -------------- | -------------------- | ---------------------------------------------------------------- |
| AppShell       | `AppShell.jsx`       | Root layout wrapper — content area + BottomNav, uses `<Outlet>`  |
| BottomNav      | `BottomNav.jsx`      | Five-tab mobile bottom navigation with animated active indicator |
| StreamSwitcher | `StreamSwitcher.jsx` | Segmented control for switching Pulse / Vision / Core streams    |
| Drawer         | `Drawer.jsx`         | Physics-based slide-up panel with overlay (framer-motion spring) |

## Navigation Tabs (BottomNav)

| Tab     | Icon | Route      | Label   |
| ------- | ---- | ---------- | ------- |
| Home    | 🌀   | `/`        | Home    |
| Modules | 📚   | `/modules` | Modules |
| Hearth  | 🔥   | `/hearth`  | Hearth  |
| Map     | 🗺️   | `/map`     | Map     |
| Pause   | 🌙   | `/pause`   | Pause   |

## Architecture Notes

- `AppShell` wraps `<Outlet />` from React Router — all page routes are children
- `BottomNav` uses `useNavigate` and `useLocation` for active tab detection
- `StreamSwitcher` reads/writes `activeStream` via `AppContext`
- `Drawer` uses `AnimatePresence` + `motion.div` with `dragConstraints` for gesture support
