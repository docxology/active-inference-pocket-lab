import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { modules } from '../../src/data/modules.js';
import { createServer } from 'node:http';
import { cp, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

async function settled(page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          [...document.querySelectorAll('[style]')].filter(
            (element) =>
              element.textContent.trim() &&
              element.style.opacity &&
              Number(element.style.opacity) < 0.99 &&
              element.getBoundingClientRect().width > 0,
          ).length,
      ),
    )
    .toBe(0);
}

async function accessibility(page) {
  await settled(page);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  await test
    .info()
    .attach('accessibility', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(
    result.violations
      .filter((item) => ['critical', 'serious'].includes(item.impact))
      .map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => ({ target: node.target, reason: node.failureSummary })),
      })),
  ).toEqual([]);
}

async function healthy(page, errors) {
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('[role="alert"]')).toHaveCount(0);
  await expect(page.locator('.katex-error, vite-error-overlay')).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const mod of modules) {
  for (const stream of ['pulse', 'vision', 'core']) {
    test(`Module ${mod.id}: ${stream} learning and retrieval`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`/modules/${mod.id}`);
      await page.getByRole('tab', { name: new RegExp(stream, 'i') }).click();
      const panel = page.locator(`#stream-panel-${stream}`);
      await expect(panel).toBeVisible();
      await expect(panel).not.toBeEmpty();
      await settled(page);
      const slider = panel.getByRole('slider').first();
      if (await slider.count()) {
        await slider.focus();
        await slider.press('ArrowRight');
      }
      const beats = page.getByRole('button', { name: /^Beat / });
      const count = await beats.count();
      for (let i = 0; i < count; i++) {
        await beats.nth(i).click();
        await expect(beats.nth(i)).toHaveAttribute('aria-current', 'step');
        // Wait for the actual beat after the outgoing animation finishes.
        await expect(panel.locator('.stream-t__beat')).toHaveAttribute(
          'data-beat-id',
          await beats.nth(i).getAttribute('data-beat-id'),
        );
        const quiz = panel.locator('.quiz');
        if (await quiz.count()) {
          for (let q = 0; q < mod.quiz.length; q++) {
            await quiz
              .locator('.quiz__question')
              .nth(q)
              .getByRole('button')
              .nth(mod.quiz[q].correctIndex)
              .click();
          }
          await quiz.getByRole('button', { name: 'Check my thinking' }).click();
          await expect(quiz.getByRole('status')).toContainText('3/3');
        }
        await healthy(page, errors);
      }
      if (count === 0 && stream === 'core') {
        const quiz = panel.locator('.quiz');
        for (let q = 0; q < mod.quiz.length; q++) {
          await quiz
            .locator('.quiz__question')
            .nth(q)
            .getByRole('button')
            .nth(mod.quiz[q].correctIndex)
            .click();
        }
        await quiz.getByRole('button', { name: 'Check my thinking' }).click();
        await expect(quiz.getByRole('status')).toContainText('3/3');
      }
      await accessibility(page);
      await healthy(page, errors);
    });
  }
}

for (const route of [
  '/',
  '/modules',
  '/map',
  '/hearth',
  '/pause',
  '/glossary',
  '/search',
  '/settings',
  '/unknown',
  '/modules/999',
]) {
  test(`Route ${route} renders and remains accessible`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator('main')).toContainText(
      /Spin|Modules|Map|Hearth|Orbit|Glossary|Search|Settings|found|exist/i,
    );
    await healthy(page, errors);
    await accessibility(page);
  });
}

test('saved stream and step survive pause, home resume and reload', async ({ page }) => {
  await page.goto('/modules/2');
  await page.getByRole('tab', { name: /Vision/ }).click();
  const vision = page.locator('#stream-panel-vision');
  await expect(vision).toBeVisible();
  await vision.getByRole('button', { name: 'Beat 2' }).click();
  await expect(page.getByRole('button', { name: 'Beat 2' })).toHaveAttribute(
    'aria-current',
    'step',
  );
  await page.getByRole('button', { name: 'Pause and rest' }).click();
  await page.getByRole('button', { name: 'Home', exact: true }).click();
  await page.getByRole('button', { name: /Continue where you left off/ }).click();
  await expect(page.getByRole('tab', { name: /Vision/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Beat 2' })).toHaveAttribute(
    'aria-current',
    'step',
  );
  await expect(page.getByRole('button', { name: 'Pause and rest' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('tab', { name: /Vision/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Beat 2' })).toHaveAttribute(
    'aria-current',
    'step',
  );
});

test('settings affect stream entry, text size and math', async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: /Core/ }).click();
  await page.getByRole('button', { name: 'X-Large' }).click();
  await page.getByRole('checkbox', { name: 'Show math' }).check();
  await page.goto('/modules/1');
  await expect(page.getByRole('tab', { name: /Core/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe(
    '20px',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('drawer focus, escape and keyboard stream selection', async ({ page }) => {
  await page.goto('/modules/1');
  const pulse = page.getByRole('tab', { name: /Pulse/ });
  await pulse.focus();
  await pulse.press('End');
  await expect(page.getByRole('tab', { name: /Core/ })).toBeFocused();
  await page.getByRole('button', { name: 'Open the Sandbox' }).click();
  const close = page.getByRole('button', { name: 'Close drawer' });
  await expect(close).toBeFocused();
  await close.press('Shift+Tab');
  await expect(
    page.getByRole('dialog').getByRole('math', { name: /Adjust the sliders/ }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open the Sandbox' })).toBeFocused();
});

test('corrupt legacy storage cannot blank the lab', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('spin_module_progress', JSON.stringify({ 1: { pulse: 'bad' }, 2: null }));
    localStorage.setItem(
      'spin_activity_bank',
      JSON.stringify({ sessions: null, goodQuestions: 'bad', bookmark: { moduleId: 99 } }),
    );
    localStorage.setItem(
      'spin_settings',
      JSON.stringify({ fontScale: -2, defaultStream: 'missing' }),
    );
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Spin', exact: true })).toBeVisible();
  await page.goto('/hearth');
  await expect(page.getByRole('heading', { name: 'The Hearth', exact: true })).toBeVisible();
});

test('uncached module and math load offline from the installed production bundle', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.goto('/modules/10');
  await expect(page.getByRole('heading', { name: 'The Whole Orbit', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: /Core/ }).click();
  await expect(page.getByRole('tabpanel').locator('.katex').first()).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Offline' })).toBeVisible();
  await context.setOffline(false);
});

test('installed lab offers and applies a real worker update without losing progress', async ({
  page,
}) => {
  const site = test.info().outputPath('update-site');
  await cp('dist', site, { recursive: true });
  const html = await readFile(join(site, 'index.html'), 'utf8');
  const worker = await readFile(join(site, 'sw.js'), 'utf8');
  const oldAsset = '/assets/old-only-module.js';
  await writeFile(join(site, oldAsset.slice(1)), 'export const oldModule = true;');
  let currentVersion;
  const writeVersion = async (version) => {
    currentVersion = version;
    await writeFile(
      join(site, 'index.html'),
      html.replace('</head>', `<meta name="lab-build" content="${version}"></head>`),
    );
    await writeFile(
      join(site, 'sw.js'),
      worker
        .replace(/const SW_VERSION = '[^']+'/, `const SW_VERSION = 'spin-update-${version}'`)
        .replace(
          'const CORE = [',
          version === 'a' ? `const CORE = ['${oldAsset}',` : 'const CORE = [',
        ),
    );
  };
  await writeVersion('a');
  const types = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.webmanifest': 'application/manifest+json',
  };
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (currentVersion === 'b' && pathname === oldAsset) {
      response.writeHead(404);
      response.end('Retired module');
      return;
    }
    const relative = extname(pathname) ? pathname.slice(1) : 'index.html';
    try {
      const body = await readFile(join(site, relative));
      response.writeHead(200, {
        'Content-Type': types[extname(relative)] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    await expect(page.locator('meta[name="lab-build"]')).toHaveAttribute('content', 'a');
    await writeVersion('b');
    await page.evaluate(async () => {
      await (await navigator.serviceWorker.getRegistration()).update();
    });
    await expect(page.getByRole('button', { name: 'Update available · reload lab' })).toBeVisible();
    await page.evaluate(() =>
      localStorage.setItem('spin_module_progress', JSON.stringify({ 1: { pulse: 75 } })),
    );
    await page.getByRole('button', { name: 'Update available · reload lab' }).click();
    await expect(page.locator('meta[name="lab-build"]')).toHaveAttribute('content', 'b');
    expect(
      await page.evaluate(() => JSON.parse(localStorage.getItem('spin_module_progress'))[1].pulse),
    ).toBe(75);
    await expect(page.getByRole('button', { name: 'Update available · reload lab' })).toHaveCount(
      0,
    );
    expect(await page.evaluate(async (path) => (await fetch(path)).text(), oldAsset)).toBe(
      'export const oldModule = true;',
    );
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
