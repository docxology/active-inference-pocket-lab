# AGENTS.md — data/

## Purpose
Static data layer and module registry.

## Files
- `modules.js` — 10-module registry with metadata, availability, stream descriptions

## Lookup Functions
- `getAllModules()` → all 10 modules
- `getModuleById(id)` → by numeric ID (1-10)
- `getModuleBySlug(slug)` → by URL slug
- `getAvailableModules()` → only implemented modules

## Module Availability
- Module 1: available (`true`)
- Modules 2-10: scaffolded (`false`)

## Adding Modules
Set `available: true` in the module entry, then add stream implementations in `src/modules/moduleN/`.
