# company-ui

An Angular 22 workspace containing a component/design system published to GitHub Packages under the `@idealink-material` npm scope, plus a `playground` app used to develop and demo the components.

## Packages

Five libraries build in dependency order into one npm package each:

```
ui-utils  ─┐
ui-icons  ─┼─► ui-core ─► ui-layout
ui-theme  ─┘
```

| Package | What it is |
|---|---|
| `@idealink-material/ui-utils` | Framework-agnostic services/types with no UI: menu, breadcrumb, loading, permission, dialog, toast. |
| `@idealink-material/ui-icons` | Icon registry service and `<lib-icon>` component. |
| `@idealink-material/ui-theme` | Theme definitions (`light`, `dark`, `banking`, `corporate`, `blue`, `green`, `purple`) and `ThemeService`. |
| `@idealink-material/ui-core` | The component library — atoms, forms, layout, navigation, overlays, feedback, data components. Depends on ui-utils, ui-icons, ui-theme. |
| `@idealink-material/ui-layout` | Placeholder library, not yet built out. |

Each library's `public-api.ts` is a hard boundary: only what's exported there is importable by consumers.

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` builds all libraries once, then rebuilds them in watch mode in dependency order (base libs → ui-core → ui-layout), and serves the playground app at `http://localhost:4200/`. The ordering matters: `ng-packagr --watch` clears and rewrites its output directory on every rebuild, including the first one, so libraries must come up in dependency order or a downstream project can read an upstream `dist/` mid-rewrite and fail with a `TS2307` module-not-found error.

## Common commands

**Build all libraries once** (required before `ng serve playground` will resolve `@idealink-material/*` imports — local dev resolves those imports to `./dist/*` via `tsconfig.json` path mappings, not to source):
```bash
npm run build:libs
```

**Build a single library or the playground app:**
```bash
ng build ui-core
ng build playground
```

**Run unit tests** (Vitest via `@angular/build:unit-test`):
```bash
ng test                 # playground app
ng test ui-core         # a specific library — ui-core, ui-icons, ui-theme, ui-utils, ui-layout
```

**Format code:**
```bash
npx prettier --write .
```

## Publishing

```bash
npm run publish:libs:dry   # dry run — still bumps versions, does NOT publish
npm run publish:libs       # bumps each lib's patch version, builds, publishes to GitHub Packages
```

This runs `scripts/publish.mjs`, which for each library:
1. Bumps the version with `npm version patch --no-git-tag-version` in `projects/<lib>` (persists in source `package.json`; ng-packagr copies it into `dist/<lib>/package.json` at build time).
2. Builds it with `ng build <lib>`.
3. Copies the root `.npmrc` into `dist/<lib>/.npmrc` (npm only reads a "project" `.npmrc` from the publish cwd, not parent directories) and runs `npm publish` from `dist/<lib>`.

After publishing, commit the version bumps that were written to each `projects/<lib>/package.json`.

## Installing these packages into another project

Packages publish to **GitHub Packages** (`https://npm.pkg.github.com`), not the public npm registry. In the consuming project, add an `.npmrc`:

```
@idealink-material:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<a GitHub PAT with read:packages scope>
```

Then install what you need:

```bash
npm install @idealink-material/ui-core @idealink-material/ui-utils @idealink-material/ui-icons @idealink-material/ui-theme
```

Check each package's `peerDependencies` — all currently require `@angular/common`/`@angular/core` `^22.0.0`; `ui-core` additionally requires `@angular/animations`.

## If the git remote/repository changes

Update the `repository.url` field in **each** library's `package.json` — there's no single shared source for it:
- `projects/ui-utils/package.json`
- `projects/ui-icons/package.json`
- `projects/ui-theme/package.json`
- `projects/ui-core/package.json`
- `projects/ui-layout/package.json`

This field is informational only (shown on the GitHub Packages page) and is independent of where packages actually publish. The publish registry is set separately via `publishConfig.registry` in the same files, and the auth token/scope mapping lives in `.npmrc` (gitignored, not committed — see [Installing these packages into another project](#installing-these-packages-into-another-project)).

## Notes

- Cross-library imports in this workspace resolve to build output, not source (`tsconfig.json` maps `@idealink-material/ui-core` etc. to `./dist/ui-core`). After editing a library, rebuild it (or have `npm run dev` watching it) before consumers will see the change.
- Styling uses Tailwind CSS v4 plus component-level SCSS.
- Component doc pages for the playground live under `projects/playground/src/app/docs/*`, one folder per component.
