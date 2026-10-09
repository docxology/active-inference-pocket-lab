import { describe, it, expect } from 'vitest';
import katex from 'katex';

const sources = import.meta.glob('../../modules/**/*.jsx', {
  query: '?raw',
  import: 'default',
  eager: true,
});

describe('actual JSX equation text', () => {
  for (const [path, source] of Object.entries(sources)) {
    const equations = [...source.matchAll(/latex="([^"]*)"/g)].map((match) => match[1]);
    if (!equations.length) continue;
    it(`renders every literal equation in ${path}`, () => {
      for (const latex of equations) {
        // JSX attributes preserve backslashes; unlike JavaScript strings, commands need one.
        expect(latex).not.toMatch(/\\\\[a-zA-Z]/);
        expect(() =>
          katex.renderToString(latex, { throwOnError: true, trust: false }),
        ).not.toThrow();
      }
    });
  }
});
