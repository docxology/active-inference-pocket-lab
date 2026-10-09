import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

function offlineBundle() {
  return {
    name: 'spin-offline-bundle',
    async writeBundle(options, bundle) {
      const assets = Object.keys(bundle)
        .filter((file) => file !== 'sw.js')
        .map((file) => `/${file}`)
        .sort();
      const source = await readFile(new URL('./public/sw.js', import.meta.url), 'utf8');
      const version = createHash('sha256')
        .update(JSON.stringify(assets))
        .update(source)
        .update(String(bundle['index.html']?.source || ''))
        .digest('hex')
        .slice(0, 16);
      await writeFile(
        resolve(options.dir, 'sw.js'),
        source
          .replace('__SPIN_CACHE_VERSION__', `spin-${version}`)
          .replace('/* __SPIN_PRECACHE__ */ []', JSON.stringify(assets)),
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlineBundle()],
  server: {
    port: 5173,
    host: true, // Allow network access for mobile testing
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
    include: ['src/__tests__/**/*.{test,spec}.{js,jsx}'],
  },
});
