# pages/

Route-level page components for Spin.

## Pages

| Page        | File                     | Route                | Description                                                    |
| ----------- | ------------------------ | -------------------- | -------------------------------------------------------------- |
| Home        | `HomePage.jsx`           | `/`                  | Landing page with hero, resume card, quick start, stats, quote |
| Module List | `ModuleListPage.jsx`     | `/modules`           | Catalog of all 10 modules with progress bars                   |
| Module View | `ModulePage.jsx`         | `/modules/:moduleId` | Active module with StreamSwitcher + stream content             |
| Map         | `ProficiencyMapPage.jsx` | `/map`               | Visual progress grid across all modules × 3 streams            |
| Hearth      | `HearthPage.jsx`         | `/hearth`            | Community celebration, stats, clarity badges                   |
| Pause       | `PausePage.jsx`          | `/pause`             | Planned pause page with bookmark display                       |
| Glossary    | `GlossaryPage.jsx`       | `/glossary`          | Terms with deep-linkable anchors                               |
| Search      | `SearchPage.jsx`         | `/search`            | Search modules and glossary                                    |
| Settings    | `SettingsPage.jsx`       | `/settings`          | Motion, haptics, font scale, defaults                          |
| 404         | `NotFoundPage.jsx`       | `*`                  | Unknown paths                                                  |

## Routing

All pages are children of `<AppShell>` (which renders `<Outlet>`). Routes defined in `App.jsx`.

## Key Page: ModulePage

`ModulePage.jsx` is the most complex page. It:

1. Reads `moduleId` from URL params
2. Looks up module data via `getModuleById()`
3. Resolves stream component from `MODULE_STREAMS` map
4. Renders `StreamSwitcher` + active stream content
5. Includes `PauseButton` for bookmarking

### MODULE_STREAMS Registry

`MODULE_STREAMS` maps numeric IDs `1` … `10` to lazy-loaded `{ pulse, vision, core }` components per module (see `ModulePage.jsx`).
