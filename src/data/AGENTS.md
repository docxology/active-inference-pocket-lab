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

All 10 modules use `available: true` with stream bundles in `src/modules/module1` through `src/modules/module10`.

## Adding a New Module

After module 10, add `moduleN/` streams, register in `ModulePage.jsx` → `MODULE_STREAMS`, and add a new entry in `modules.js` with `available: true`.
