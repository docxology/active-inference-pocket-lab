/**
 * @file modules.test.js — Module registry tests
 * @description Tests the module data layer.
 */
import { describe, it, expect } from 'vitest';
import modules, {
  getAllModules,
  getModuleById,
  getModuleBySlug,
  getAvailableModules,
} from '../../data/modules';

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

  it('all 10 modules are available', () => {
    expect(getAvailableModules()).toHaveLength(10);
    expect(modules.every((m) => m.available)).toBe(true);
  });

  it('each module slug is unique', () => {
    const slugs = modules.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('each module has a 3-question quiz with required fields', () => {
    for (const mod of modules) {
      expect(mod.quiz, `module ${mod.id}`).toBeDefined();
      expect(mod.quiz, `module ${mod.id}`).toHaveLength(3);
      mod.quiz.forEach((q, qi) => {
        expect(q, `module ${mod.id} question ${qi}`).toHaveProperty('prompt');
        expect(typeof q.prompt).toBe('string');
        expect(q.prompt.length).toBeGreaterThan(0);
        expect(q).toHaveProperty('options');
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        q.options.forEach((opt) => {
          expect(typeof opt).toBe('string');
          expect(opt.length).toBeGreaterThan(0);
        });
        expect(q).toHaveProperty('correctIndex');
        expect(Number.isInteger(q.correctIndex)).toBe(true);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q).toHaveProperty('explanation');
        expect(typeof q.explanation).toBe('string');
        expect(q.explanation.length).toBeGreaterThan(0);
      });
    }
  });

  it('each module lists glossary keys as non-empty strings', () => {
    for (const mod of modules) {
      expect(mod.glossary).toBeDefined();
      expect(Array.isArray(mod.glossary)).toBe(true);
      expect(mod.glossary.length).toBeGreaterThan(0);
      mod.glossary.forEach((k) => {
        expect(typeof k).toBe('string');
        expect(k.length).toBeGreaterThan(0);
      });
    }
  });
});
