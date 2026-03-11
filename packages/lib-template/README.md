# @greenstones/lib-template

> Starter template for new `@greenstones` React component libraries. Copy this package to bootstrap a new library with Vite, TypeScript, Storybook, and dual ESM/UMD output already configured.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF)](https://vitejs.dev/)
[![Storybook](https://img.shields.io/badge/Storybook-8-FF4785)](https://storybook.js.org/)

---

## Why this template

Setting up a new React component library involves the same boilerplate every time: Vite library mode, `vite-plugin-dts` for declaration files, `tsconfig.json` with stories excluded from compilation, barrel exports, Storybook configuration, and dual ESM/UMD output. This template encodes those decisions once so new packages start clean.

**What you get out of the box**

- **Vite library build** — produces `dist/*.js` (ESM) and `dist/*.umd.cjs` (UMD) with source maps
- **TypeScript declarations** — `vite-plugin-dts` emits `dist/index.d.ts` automatically
- **Strict TypeScript** — `strict: true`, stories and tests excluded from `tsc`
- **Barrel export pattern** — `src/lib/index.ts` → `components/index.ts` → `atoms/index.ts` → component
- **Storybook ready** — story file and `.storybook/` config included
- **Vitest ready** — test file using `@testing-library/react` included
- **CSS export** — `dist/style.css` is a named export so consumers opt into styles explicitly
- **Peer dependency model** — `react` and `react-dom` are peers, not bundled

---

## Creating a new package from this template

```bash
# 1. Copy the template
cp -r packages/lib-template packages/my-new-lib

# 2. Update package.json
#    - name:    "@greenstones/my-new-lib"
#    - version: "0.0.1"
#    - main:    "./dist/my-new-lib.umd.cjs"
#    - module:  "./dist/my-new-lib.js"

# 3. Update vite.config.ts
#    - lib.fileName: "my-new-lib"
#    - lib.name:     "MyNewLib"

# 4. Install dependencies from the repo root
bun install

# 5. Start Storybook
cd packages/my-new-lib && bun run storybook
```

Fields to change in **`package.json`**:

| Field | Template value | Replace with |
|-------|---------------|--------------|
| `name` | `@greenstones/lib-template` | `@greenstones/your-lib-name` |
| `main` | `./dist/lib-template.umd.cjs` | `./dist/your-lib-name.umd.cjs` |
| `module` | `./dist/lib-template.js` | `./dist/your-lib-name.js` |

Fields to change in **`vite.config.ts`**:

| Field | Template value | Replace with |
|-------|---------------|--------------|
| `lib.fileName` | `"lib-template"` | `"your-lib-name"` |
| `lib.name` | `"LibTemplate"` | `"YourLibName"` (UMD global) |

---

## Package structure

```
packages/lib-template/
├── src/
│   ├── lib/
│   │   ├── index.ts                          # Entry — imports CSS, re-exports components
│   │   ├── storybook-utils.ts                # Storybook control helpers
│   │   ├── styles/
│   │   │   └── core.css                      # Global library styles
│   │   └── components/
│   │       ├── index.ts                      # Re-exports atoms
│   │       └── atoms/
│   │           ├── index.ts                  # Re-exports individual atoms
│   │           └── at-button/
│   │               ├── index.tsx             # Component source + exports
│   │               ├── Button.css            # Component styles
│   │               ├── at-button.stories.tsx # Storybook story (excluded from tsc)
│   │               └── at-button.test.tsx    # Vitest test (excluded from tsc)
│   └── vite-env.d.ts                         # Vite client types
├── .storybook/                               # Storybook configuration
├── vite.config.ts                            # Library build configuration
├── tsconfig.json                             # TypeScript configuration
├── eslint.config.js                          # ESLint configuration
└── package.json
```

The `atoms/` directory is the conventional home for low-level, single-responsibility components. Add `molecules/` and `organisms/` directories as the library grows, following the same barrel-export pattern.

---

## Commands

```bash
bun run dev            # Vite dev server
bun run build          # tsc + Vite library build → dist/
bun run watch          # Watch mode build
bun run lint           # ESLint
bun run storybook      # Storybook on http://localhost:6006
bun run build-storybook # Static Storybook build
bun run show-bundle    # Bundle size visualiser
```

---

## API Documentation

The template ships with one example component (`AtButton`) to demonstrate the conventions. Replace or extend it when creating a real library.

### Table of Contents

| Module | Description |
|--------|-------------|
| [components/atoms](#componentsatoms) | Example atom-level button component |

---

### `components/atoms`

#### `AtButton`

Example atom-level button component. Demonstrates the prop interface pattern, variant constant/type pattern, and CSS class mapping. Replace with your real component.

```ts
export const AtButton: (props: AtButtonProps) => JSX.Element
```

**Props**

```ts
interface AtButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: AtButtonVariant;
  isDisabled?: boolean;
}
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | **yes** | Button label text |
| `variant` | `AtButtonVariant` | no | Visual variant (default: `'PRIMARY'`) |
| `isDisabled` | `boolean` | no | Disables click handler (default: `false`) |
| `...rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | no | All standard button attributes |

**Returns:** `JSX.Element` — an HTML `<button>` element.

```tsx
import { AtButton } from '@greenstones/lib-template';

<AtButton label="Click me" />
<AtButton label="Save" variant="PRIMARY" />
<AtButton label="Cancel" variant="SECONDARY" isDisabled />
```

---

#### `AT_BUTTON_VARIANT`

Const object of available button variants. Use as the source of truth instead of raw strings.

```ts
const AT_BUTTON_VARIANT: {
  readonly PRIMARY:   'primary';
  readonly SECONDARY: 'secondary';
  readonly TERTIARY:  'tertiary';
}
```

```ts
import { AT_BUTTON_VARIANT } from '@greenstones/lib-template';

const variant = AT_BUTTON_VARIANT.PRIMARY; // 'primary'
```

---

#### `AtButtonVariant`

Union type derived from `AT_BUTTON_VARIANT` keys.

```ts
type AtButtonVariant = 'PRIMARY' | 'SECONDARY' | 'TERTIARY'
```

---

#### `variantClasses`

Maps each `AtButtonVariant` to a Tailwind CSS class string. Demonstrates the pattern for variant-to-class mapping; wire it into the component's `className` as needed.

```ts
const variantClasses: Record<AtButtonVariant, string> = {
  PRIMARY:   'bg-green-200 hover:bg-green-400 active:bg-green-500',
  SECONDARY: 'bg-blue-200 hover:bg-blue-400 active:bg-blue-500',
  TERTIARY:  'bg-red-200 hover:bg-red-400 active:bg-red-500',
}
```

```tsx
import { variantClasses } from '@greenstones/lib-template';

// Wire into a component:
<button className={variantClasses[variant]}>{label}</button>
```

---

### `storybook-utils`

#### `objectValuesToControls`

Converts an object's keys into a Storybook `argTypes` control definition. Use when a component has a variant const to keep controls in sync automatically.

```ts
function objectValuesToControls(
  obj: Record<string, string>,
  control?: string,
): { control: string; options: string[] }
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `obj` | `Record<string, string>` | **yes** | Object whose keys become control options |
| `control` | `string` | no | Storybook control type (default: `'select'`) |

**Returns:** `{ control: string; options: string[] }` — spread directly into `argTypes`.

```ts
import { objectValuesToControls, AT_BUTTON_VARIANT } from '@greenstones/lib-template';
import type { Meta } from '@storybook/react';
import { AtButton } from './index';

const meta: Meta<typeof AtButton> = {
  component: AtButton,
  argTypes: {
    variant: objectValuesToControls(AT_BUTTON_VARIANT),
    // expands to: { control: 'select', options: ['PRIMARY', 'SECONDARY', 'TERTIARY'] }
  },
};
```

---

## Advanced Usage

### Adding a new atom component

Follow the same structure as `at-button`. Each atom lives in its own directory with four files:

```
src/lib/components/atoms/my-component/
├── index.tsx             # Component + exported types
├── MyComponent.css       # Scoped styles
├── my-component.stories.tsx
└── my-component.test.tsx
```

Then re-export from `atoms/index.ts`:

```ts
// src/lib/components/atoms/index.ts
export * from './at-button';
export * from './my-component';  // add this line
```

### Adding a molecules layer

```
src/lib/components/
├── atoms/
│   └── index.ts
├── molecules/
│   ├── my-form/
│   │   └── index.tsx
│   └── index.ts            # export * from './my-form'
└── index.ts                # add: export * from './molecules'
```

### Extending peer dependencies

Add new peers to `package.json` and declare them as external in `vite.config.ts`:

```ts
// vite.config.ts
build: {
  lib: { ... },
  rollupOptions: {
    external: [
      'react', 'react-dom',
      'my-new-peer',           // add here
      /^my-new-peer\/.*/,      // and sub-paths if needed
    ],
  },
},
```

### Using with `@greenstones/qui-core`

If the new library depends on `@greenstones/qui-core`, add it as a peer dependency and external:

```json
// package.json
"peerDependencies": {
  "@greenstones/qui-core": "*",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

```ts
// vite.config.ts — already included in the template externals list
external: [..., '@greenstones/qui-core']
```

---

## TypeScript

### Variant constant + type pattern

The template demonstrates a pattern for defining a closed set of string values with a matching TypeScript type:

```ts
// Define the constant (source of truth)
export const AT_BUTTON_VARIANT = {
  PRIMARY:   'primary',
  SECONDARY: 'secondary',
  TERTIARY:  'tertiary',
} as const;

// Derive the type from the keys
export type AtButtonVariant = keyof typeof AT_BUTTON_VARIANT;
// → 'PRIMARY' | 'SECONDARY' | 'TERTIARY'
```

Apply the same pattern to any enum-like value in your library:

```ts
export const STATUS = {
  IDLE:    'idle',
  LOADING: 'loading',
  ERROR:   'error',
} as const;

export type Status = keyof typeof STATUS;
// → 'IDLE' | 'LOADING' | 'ERROR'
```

### Extending native element props

Use `extends` on the relevant HTML attributes interface so consumers can pass any standard attribute without extra boilerplate:

```ts
import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Button — inherits onClick, type, form, disabled, aria-*, data-*, …
interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

// Input — inherits value, onChange, placeholder, autoComplete, …
interface MyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
```

### Record-mapped class strings

```ts
const variantClasses: Record<AtButtonVariant, string> = {
  PRIMARY:   'bg-green-200 hover:bg-green-400',
  SECONDARY: 'bg-blue-200 hover:bg-blue-400',
  TERTIARY:  'bg-red-200 hover:bg-red-400',
};

// TypeScript enforces every variant has a class — no runtime `undefined` lookups:
function getClass(v: AtButtonVariant): string {
  return variantClasses[v]; // always string
}
```

---

## Configuration

### `vite.config.ts` options

| Option | Template value | Description |
|--------|---------------|-------------|
| `build.lib.entry` | `src/lib/index.ts` | Library entry point |
| `build.lib.formats` | `['es', 'umd']` | Output formats |
| `build.lib.fileName` | `'lib-template'` | Output file name prefix |
| `build.lib.name` | `'LibTemplate'` | UMD global variable name |
| `build.sourcemap` | `true` | Emit source maps |
| `plugins.dts.insertTypesEntry` | `true` | Emit `dist/index.d.ts` |

### `tsconfig.json` options

| Option | Value | Description |
|--------|-------|-------------|
| `strict` | `true` | Full strict mode |
| `target` | `ESNext` | Compile to latest JS |
| `jsx` | `react-jsx` | React 17+ automatic JSX transform |
| `exclude` | `*.stories.*`, `*.test.*` | Stories and tests excluded from compilation |

### CSS export

The generated `dist/style.css` is a named package export. Consumers must import it explicitly — this is intentional:

```ts
// consumer app
import '@greenstones/my-lib/dist/style.css';
```

---

## Error Handling

The template does not define custom error types. Components follow React's standard error patterns:

- **PropTypes / TypeScript** — invalid props are caught at compile time via the `AtButtonProps` interface
- **Runtime errors** — if an unhandled exception occurs inside a component, let a React error boundary in the consuming app catch it

When building a real library, consider adding an error boundary component and documenting the error types your async operations can throw.

---

## Contributing

### Setup

```bash
# Clone the monorepo
git clone <repo-url>
cd react-qui

# Install all workspace dependencies
bun install

# Work on the template
cd packages/lib-template
bun run storybook      # Component development on http://localhost:6006
bun run build          # Verify production build
bun run lint           # ESLint
```

### Running tests

```bash
# From the package directory
npx vitest run         # Run once
npx vitest             # Watch mode
```

### PR guide

1. Fork and create a feature branch: `git checkout -b feat/my-feature`
2. Keep changes generic — this is a template, not a real library
3. Add a Storybook story for any new example component
4. Add a Vitest test alongside each component
5. Run `bun run lint` and `bun run build` — both must pass
6. Open a pull request against `main`

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full release history.

---

## License

MIT © Greenstones GmbH
