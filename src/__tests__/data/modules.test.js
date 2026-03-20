/**
 * @file modules.test.js — Module registry tests
 * @description Tests the module data layer.
 */
import { describe, it, expect } from 'vitest';
import modules, { getAllModules, getModuleById, getModuleBySlug, getAvailableModules } from '../../data/modules';

describe('Module Registry', () => {
  it('exports 10 modules', () => {
    expect(modules).toHaveLength(10);
    expect(getAllModules()).toHaveLength(10);
  });

  it('each module has required fields', () => {
    for (const mod of modules) {
      expect(mod).toHaveProperty('id');
      expect(mod).toHaveProperty('slug');
      expect(mod).toHaveProperty('title');
      expect(mod).toHaveProperty('subtitle');
      expect(mod).toHaveProperty('description');
      expect(mod).toHaveProperty('icon');
      expect(mod).toHaveProperty('firstAction');
      expect(mod).toHaveProperty('streams');
      expect(mod.streams).toHaveProperty('pulse');
      expect(mod.streams).toHaveProperty('vision');
      expect(mod.streams).toHaveProperty('core');
      expect(typeof mod.available).toBe('boolean');
    }
  });

  it('module IDs are sequential 1-10', () => {
    modules.forEach((mod, i) => {
      expect(mod.id).toBe(i + 1);
    });
  });

  it('getModuleById returns the correct module', () => {
    const mod = getModuleById(1);
    expect(mod).toBeDefined();
    expect(mod.title).toBe('The First Orbit');
    expect(mod.slug).toBe('the-first-orbit');
  });

  it('getModuleBySlug returns the correct module', () => {
    const mod = getModuleBySlug('the-first-orbit');
    expect(mod).toBeDefined();
    expect(mod.id).toBe(1);
  });

  it('getAvailableModules returns only available modules', () => {
    const available = getAvailableModules();
    expect(available.length).toBeGreaterThan(0);
    available.forEach((mod) => {
      expect(mod.available).toBe(true);
    });
  });

  it('Module 1 is available', () => {
    const mod = getModuleById(1);
    expect(mod.available).toBe(true);
  });

  it('each module slug is unique', () => {
    const slugs = modules.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
