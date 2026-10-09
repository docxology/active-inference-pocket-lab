import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [['list']],
  outputDir: process.env.SPIN_BROWSER_OUTPUT || 'test-results',
  use: {
    baseURL: process.env.SPIN_BASE_URL || 'http://localhost:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: process.env.SPIN_BASE_URL
    ? undefined
    : {
        command: './run.sh preview',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
      },
});
