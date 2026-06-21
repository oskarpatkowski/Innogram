import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  globalSetup: require.resolve('./playwright/tests/global-setup'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev --prefix apps/client_app -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 120 * 1000,
    env: {
      CORE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
      COVERAGE_ENABLED: 'true', // Add this line
    },
  },
});