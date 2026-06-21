const { execSync } = require('child_process');
const { existsSync, mkdirSync, rmSync, readdirSync, copyFileSync } = require('fs');
const { join } = require('path');

const mergedCoverageDir = 'coverage/merged';
const tempMergeDir = '.nyc_output';

// Clean up previous runs
if (existsSync(mergedCoverageDir)) {
  rmSync(mergedCoverageDir, { recursive: true, force: true });
}
if (existsSync(tempMergeDir)) {
  rmSync(tempMergeDir, { recursive: true, force: true });
}
mkdirSync(mergedCoverageDir, { recursive: true });
mkdirSync(tempMergeDir, { recursive: true });

let fileCount = 0;

// Copy unit test coverage
if (existsSync('apps/coverage/unit/coverage-final.json')) {
  copyFileSync('apps/coverage/unit/coverage-final.json', join(tempMergeDir, 'unit.json'));
  fileCount++;
}

// Copy integration test coverage
if (existsSync('apps/coverage/integration/coverage-final.json')) {
  copyFileSync('apps/coverage/integration/coverage-final.json', join(tempMergeDir, 'integration.json'));
  fileCount++;
}

// Copy e2e test coverage
if (existsSync('coverage/e2e')) {
  const e2eFiles = readdirSync('coverage/e2e').filter(f => f.endsWith('.json') && f !== 'playwright-coverage.json');
  e2eFiles.forEach((file, index) => {
    copyFileSync(join('coverage/e2e', file), join(tempMergeDir, `e2e-${index}.json`));
    fileCount++;
  });
}

if (fileCount > 0) {
  try {
    // nyc merge takes an input directory and an output file
    execSync(`npx nyc merge ${tempMergeDir} ${join(mergedCoverageDir, 'coverage.json')}`, {
      stdio: 'inherit',
    });

    // Generate the final report from the temporary directory containing all raw coverage files
    execSync(
      `npx nyc report --reporter=lcov --reporter=text --report-dir ${mergedCoverageDir} --temp-dir ${tempMergeDir}`,
      { stdio: 'inherit' },
    );
  } catch (error) {
    console.error('Failed to merge coverage reports:', error);
  } finally {
    // Clean up the temporary directory
    if (existsSync(tempMergeDir)) {
      rmSync(tempMergeDir, { recursive: true, force: true });
    }
  }
} else {
  console.log('No valid Istanbul coverage files found to merge.');
}