import { execSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';

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
  // npm only reads a "project" .npmrc from the publish cwd, not from parent
  // directories, so the repo-root .npmrc (with the right registry token)
  // must be copied alongside the package before publishing.
  copyFileSync('.npmrc', `dist/${lib}/.npmrc`);
  run(`npm publish${dryRun ? ' --dry-run' : ''}`, `dist/${lib}`);
}

console.log('\nDone.');
