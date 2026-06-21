import { test as base } from '@playwright/test';
import { join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';
// @ts-ignore
import v8toIstanbul from 'v8-to-istanbul';

export const test = base.extend({
  page: async ({ page }, use) => {
    if (page.coverage) {
      await page.coverage.startJSCoverage();
    }
    
    await use(page);

    if (page.coverage) {
      const coverage = await page.coverage.stopJSCoverage();
      for (const entry of coverage) {
        if (entry.url.includes('localhost') && !entry.url.includes('node_modules')) {
          const converter = v8toIstanbul(entry.source, 0, { source: entry.url });
          await converter.load();
          converter.applyCoverage(entry.functions);
          const istanbulCoverage = converter.toIstanbul();
          
          const coverageDir = join(process.cwd(), 'coverage/e2e');
          mkdirSync(coverageDir, { recursive: true });
          
          const filePath = join(coverageDir, `e2e-${Date.now()}-${Math.random().toString(36).substring(7)}.json`);
          writeFileSync(filePath, JSON.stringify(istanbulCoverage));
        }
      }
    }
  },
});

export { expect } from '@playwright/test';
