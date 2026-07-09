import { execSync } from 'node:child_process';

const LIBS = ['ui-utils', 'ui-icons', 'ui-theme', 'ui-core', 'ui-layout'];
const dryRun = process.argv.includes('--dry-run');

function run(cmd, cwd) {
  console.log(`$ ${cmd}${cwd ? ` (in ${cwd})` : ''}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

console.log('--- Building all libraries ---');
for (const lib of LIBS) {
  run(`npx ng build ${lib}`);
}

for (const lib of LIBS) {
  console.log(`\n--- Publishing ${lib} ---`);

  // Increment version without creating a Git tag
  run('npm version patch --no-git-tag-version', `dist/${lib}`);

  // Publish
  run(`npm publish${dryRun ? ' --dry-run' : ''}`, `dist/${lib}`);
}

console.log('\nDone.');
