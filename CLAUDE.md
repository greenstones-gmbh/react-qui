# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a bun workspaces monorepo containing a multi-layer React component library published under the `@clickapp` scope.

**Workspace layout:**
- `packages/` — 3 published libraries + 1 template
- `apps/` — 2 demo applications

## Commands

All commands run from the repo root unless noted otherwise.

### Development (per package/app)
```bash
bun run dev          # Start Vite dev server
bun run build        # tsc + vite build → dist/
bun run watch        # Watch mode build
bun run lint         # ESLint
bun run storybook    # Storybook on port 6006 (packages only)
```

### Build & publish all libraries
```bash
bun run build-all    # Build qui-core, qui-bootstrap, qui-supabase
bun run pub-local    # Publish all to local Verdaccio (localhost:4873) for testing
bun run pub-local-core     # Publish qui-core locally
bun run pub-local-bs       # Publish qui-bootstrap locally
bun run pub-local-supabase # Publish qui-supabase locally
bun run pub-core     # Publish qui-core to npm
bun run pub-bs       # Publish qui-bootstrap to npm
bun run pub-supabase # Publish qui-supabase to npm
```

There are no test commands — no unit/integration test framework is configured.

## Architecture

### Layer dependency order

```
qui-core  →  qui-bootstrap  →  apps
                ↑
           qui-supabase (independent, wraps Supabase JS)
```

**`@clickapp/qui-core`** — Abstract base layer. Auth contexts, generic form field abstractions, modal management context, React hooks, entity/data utilities. No styling opinions.

**`@clickapp/qui-bootstrap`** — Concrete Bootstrap 5 implementations of qui-core abstractions. Buttons, form fields (Input, Select, Date, Check, Picker), tables, navbar, app layout, modal components, page containers, detail views, tabs. Depends on `qui-core`.

**`@clickapp/qui-supabase`** — Supabase integration: auth UI wrapper and data access layer. Depends on Supabase JS client and React; independent of qui-core.

**`lib-template`** — Copy this when creating a new package; it establishes the standard package structure.

### Package structure conventions

Each library package follows this layout:
- `src/lib/` — source root; `index.ts` barrel-exports everything
- `vite.config.ts` — library build producing ESM + UMD to `dist/`
- `dist/style.css` — separate CSS export; consumers import it explicitly
- TypeScript strict mode; stories excluded from `tsc` compilation

### Module exports

Libraries export dual formats:
- `main` → `dist/*.umd.cjs` (CommonJS)
- `module` → `dist/*.js` (ESM)
- `types` → `dist/index.d.ts`
- `"./dist/style.css"` export for CSS

### Key patterns

- **Context providers**: `ModalContext` (global modal management), `SupabaseContext` (Supabase client access) — wrap apps at the root.
- **Peer dependencies**: Libraries declare `react`, `react-dom`, `bootstrap`, etc. as peers — the consuming app controls versions.
- **Storybook-driven development**: Component stories live alongside source in `src/`.

### Apps

- **`qui-example`** — Showcases qui-core + qui-bootstrap components.
- **`todo-demo-supabase-bs-vite`** — Full demo using all three libraries (core, bootstrap, supabase) with Supabase backend.
