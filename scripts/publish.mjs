import { execSync } from 'node:child_process';

const LIBS = ['ui-utils', 'ui-icons', 'ui-theme', 'ui-core', 'ui-layout'];
const dryRun = process.argv.includes('--dry-run');

function run(cmd, cwd) {
  console.log(`$ ${cmd}${cwd ? ` (in ${cwd})` : ''}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

console.log('--- Bumping versions ---');
for (const lib of LIBS) {
  // Bump the source package.json so the new version persists across runs;
  // ng-packagr copies this file into dist/<lib> verbatim at build time.
  run('npm version patch --no-git-tag-version', `projects/${lib}`);
}

console.log('\n--- Building all libraries ---');
for (const lib of LIBS) {
  run(`npx ng build ${lib}`);
}

for (const lib of LIBS) {
  console.log(`\n--- Publishing ${lib} ---`);
  run(`npm publish${dryRun ? ' --dry-run' : ''}`, `dist/${lib}`);
}

console.log('\nDone.');
