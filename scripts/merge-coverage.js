import { execSync } from 'child_process';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const coverageDirs = ['coverage/unit', 'coverage/integration'];
const mergedCoverageDir = 'coverage/merged';
const e2eCoverageDir = 'coverage/e2e';

if (!existsSync(mergedCoverageDir)) {
  mkdirSync(mergedCoverageDir, { recursive: true });
}

const coverageFiles = coverageDirs
  .filter(dir => existsSync(dir))
  .map(dir => join(dir, 'coverage-final.json'))
  .filter(file => existsSync(file));

if (existsSync(e2eCoverageDir)) {
  const playwrightCoverageFile = readdirSync(e2eCoverageDir).find(f => f.endsWith('.json'));
  if (playwrightCoverageFile) {
    coverageFiles.push(join(e2eCoverageDir, playwrightCoverageFile));
  }
}

if (coverageFiles.length > 0) {
  execSync(
    `npx nyc merge ${coverageFiles.join(
      ' ',
    )} ${mergedCoverageDir}/coverage.json`,
    { stdio: 'inherit' },
  );
  execSync(`npx nyc report --reporter=lcov --reporter=text --report-dir ${mergedCoverageDir}`, {
    stdio: 'inherit',
  });
} else {
  console.log('No coverage files found to merge.');
}
