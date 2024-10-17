const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const yarnLockPath = path.join(rootDir, 'yarn.lock');

if (!fs.existsSync(yarnLockPath)) {
  console.error(
    'yarn.lock not found. Make sure you are in the root of your Turborepo project.',
  );
  process.exit(1);
}

function extractMissingDeps(output) {
  const lines = output.split('\n');
  const missingDeps = lines
    .filter((line) => line.includes('has unmet peer dependency'))
    .map((line) => {
      const match = line.match(/"([^"]+)"$/);
      return match ? match[1] : null;
    })
    .filter((dep) => dep !== null);

  return [...new Set(missingDeps)]; // Remove duplicates
}

function addDependencies(deps) {
  if (deps.length === 0) {
    console.log('No missing dependencies found.');
    return;
  }

  console.log('Adding missing dependencies:');
  deps.forEach((dep) => console.log(`- ${dep}`));

  try {
    execSync(`yarn add -D ${deps.join(' ')}`, { stdio: 'inherit' });
    console.log('Dependencies added successfully.');
  } catch (error) {
    console.error('Error adding dependencies:', error);
  }
}

try {
  const output = execSync('yarn install', { encoding: 'utf-8' });
  const missingDeps = extractMissingDeps(output);
  addDependencies(missingDeps);
} catch (error) {
  console.error('Error running yarn install:', error);
}
