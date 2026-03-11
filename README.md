# qui — Quick UI for Enterprise Apps

[![npm](https://img.shields.io/npm/v/@clickapp/qui-core)](https://www.npmjs.com/package/@clickapp/qui-core)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-8.x-ff4785)](https://storybook.js.org/)

**qui** (quick UI) is a layered React component library for building enterprise application UIs. Built on React-Bootstrap, React Router, and React Hook Form, it delivers production-ready building blocks for role-based routing, master-detail pages, paginated table management, and async data loading — so you ship features instead of plumbing.

---

## Packages

| Package | Description |
|---------|-------------|
| [`@clickapp/qui-core`](packages/qui-core) | Abstract base layer — auth context, data hooks, column/field builders, modal stack, filter/sort utilities. No styling opinions. |
| [`@clickapp/qui-bootstrap`](packages/qui-bootstrap) | Bootstrap 5 UI layer — form fields, tables, pages, app layouts, modals, and CRUD action hooks built on top of `qui-core`. |
| [`@clickapp/qui-supabase`](packages/qui-supabase) | Supabase integration — typed repository pattern, paginated table hooks, auth provider, and Edge Function invocation. |

---

## Development

All commands run from the repo root.

```bash
# Install all workspace dependencies
npm install

# Build all libraries
npm run build-all

# Start Storybook for a package
cd packages/qui-bootstrap && npm run storybook

# Run a demo app
cd apps/qui-example && npm run dev

# Publish to local Verdaccio registry (localhost:4873) for integration testing
npm run pub-local
```

### Per-package commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc + Vite build → dist/
npm run watch    # Watch mode
npm run lint     # ESLint
```

## Contributing

1. Fork and clone the repo
2. `npm install` from the root
3. Work inside the relevant `packages/` or `apps/` directory
4. Run `npm run build` in the package you changed to verify types compile
5. Test visually with Storybook (`npm run storybook`) or the demo apps
6. Open a PR against `main`

There is no automated test suite — component behaviour is verified through Storybook stories and the demo apps.

---

## License

MIT
