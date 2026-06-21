import { mkdirSync } from 'fs';
import { join } from 'path';

async function globalSetup() {
  const coverageDir = join(process.cwd(), 'coverage/e2e');
  mkdirSync(coverageDir, { recursive: true });
}

export default globalSetup;