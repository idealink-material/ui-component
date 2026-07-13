# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Angular 22 workspace (`ng-packagr` libraries + a demo app) that publishes a component/design system to GitHub Packages under the `@idealink-material` npm scope. Five libraries build in dependency order into one package each, and a `playground` app exists to develop/showcase them.

```
ui-utils  ─┐
ui-icons  ─┼─► ui-core ─► ui-layout
ui-theme  ─┘
```

- `projects/ui-utils` — framework-agnostic services/types with no UI (menu, breadcrumb, loading, permission, dialog, toast) and a `framework-version` token. No Angular Material/CDK dependency beyond `@angular/common`/`core`.
- `projects/ui-icons` — icon registry service, `<lib-icon>` component, icon type/token definitions.
- `projects/ui-theme` — theme definitions (`light`, `dark`, `banking`, `corporate`, `blue`, `green`, `purple` in `projects/ui-theme/src/lib/themes/`) and `ThemeService`.
- `projects/ui-core` — the component library itself (atoms, forms, layout, navigation, overlays, feedback, data — see `projects/ui-core/src/public-api.ts`, organized in "waves" as the library was built out). Depends on ui-utils, ui-icons, ui-theme.
- `projects/ui-layout` — placeholder library, not yet built out (`public-api.ts` has no real exports yet).
- `projects/playground` — the Angular app used to develop and demo the libraries (`/docs/*` routes show live component docs).

Every library's `public-api.ts` is a hard boundary: only what's exported there is importable by consumers, and only what's exported there should be imported across projects within this repo too.

## Commands

Install deps first: `npm install`.

**Start the playground dev server** (builds all libs once, then rebuilds them in watch mode in dependency order, waiting for each phase to finish before starting the next — see `scripts/dev.mjs` for why the ordering matters with `ng-packagr --watch`):
```
npm run dev
```
This serves the playground at `http://localhost:4200/`.

**Build all libraries once** (in dependency order — required before `ng serve playground` will resolve `@idealink-material/*` imports, since local dev resolves those imports to `./dist/*` via `tsconfig.json` path mappings, not to source):
```
npm run build:libs
```

**Build a single library or the playground app:**
```
ng build ui-core
ng build playground
```

**Run unit tests** (Vitest via `@angular/build:unit-test`):
```
ng test                # playground app
ng test ui-core         # a specific library, e.g. ui-core, ui-icons, ui-theme, ui-utils, ui-layout
```

**Publish all libraries to GitHub Packages** (bumps each lib's patch version in its source `package.json`, builds all libs, then `npm publish`s each from `dist/<lib>`):
```
npm run publish:libs          # real publish
npm run publish:libs:dry      # --dry-run, no version bump side effects to verify but does write version bumps — check `git diff` before committing
```
See `scripts/publish.mjs`. Versions are bumped with `npm version patch --no-git-tag-version` run inside each `projects/<lib>` directory (not in `dist/`), so the bump persists in source and is copied into `dist/<lib>/package.json` by ng-packagr on the next build. After publishing, commit the resulting `package.json` version bumps.

## Registry / installing these packages into another project

Packages publish to GitHub Packages (`https://npm.pkg.github.com`), not the public npm registry, under the `@idealink-material` scope (see each library's `publishConfig.registry` in `projects/*/package.json`).

To install `@idealink-material/*` packages into a different project, that project needs an `.npmrc` with:
```
@idealink-material:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<a GitHub PAT with read:packages scope>
```
Then `npm install @idealink-material/ui-core @idealink-material/ui-utils @idealink-material/ui-icons @idealink-material/ui-theme` etc. as needed — check each library's `peerDependencies` (all currently require `@angular/common`/`@angular/core` `^22.0.0`, `ui-core` additionally requires `@angular/animations`).

This repo's own root `.npmrc` (gitignored, not committed) holds the token used by `publish:libs` and by `npm install` here. `scripts/publish.mjs` copies it into each `dist/<lib>` before publishing because npm only reads a "project" `.npmrc` from the publish cwd, not from parent directories.

## If the git remote/repository changes

Update the `repository.url` field in **each** library's `package.json` — there is no single shared source for this:
- `projects/ui-utils/package.json`
- `projects/ui-icons/package.json`
- `projects/ui-theme/package.json`
- `projects/ui-core/package.json`
- `projects/ui-layout/package.json`

These are informational (shown on the npm/GitHub Packages page) and independent of the registry itself — changing them does not change where packages publish. The publish registry is set separately via `publishConfig.registry` in the same files, and the auth token/scope mapping lives in `.npmrc` (not committed).

## Architecture notes

- **Local cross-library imports resolve to build output, not source.** `tsconfig.json` maps `@idealink-material/ui-core` (etc.) to `./dist/ui-core`. This means after editing a library, you must rebuild it (or have `npm run dev` / `scripts/dev.mjs` watching it) before consumers — including the playground — see the change.
- **`scripts/dev.mjs` exists to solve a specific race**: `ng-packagr --watch` clears and rewrites its output directory on every rebuild, including the first one. Running all watchers via plain `concurrently` (no ordering) lets a downstream project read an upstream `dist/` mid-rewrite and fail with `TS2307`. `dev.mjs` waits for each lib's "Compilation complete" signal before starting the next phase (base libs → ui-core → ui-layout → playground serve).
- **Component doc pages** for the playground live under `projects/playground/src/app/docs/*` (one folder per component, e.g. `data-table`, `select`), each with its own `.component.ts/.html/.scss`.
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`) plus component-level SCSS.
- **Formatting**: Prettier is configured via root `.prettierrc` (`printWidth: 100`, `singleQuote: true`, Angular parser for `*.html`), but there's no `format` npm script — run `npx prettier --write .` manually. No ESLint config, Cursor rules, or Copilot instructions are checked into this repo.
