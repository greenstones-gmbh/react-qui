# @greenstones/qui-supabase

> Supabase integration for React — authentication provider, role-based access control, repository pattern, and paginated table hooks.

[![npm version](https://img.shields.io/npm/v/@greenstones/qui-supabase)](https://www.npmjs.com/package/@greenstones/qui-supabase)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Supabase](https://img.shields.io/badge/Supabase-JS%20v2-green)](https://supabase.com/)

---

## Why this library

`@greenstones/qui-supabase` provides ready-made, reusable building blocks for wiring Supabase into a React application:

- **Auth provider** — `SupabaseAuth` handles session initialisation, auth state change events, login/logout navigation, and populates `AuthContext` from `@greenstones/qui-core`. Drop it in once; every downstream component gets authentication state automatically.
- **Auth UI** — `SupabaseAuthUI` wraps Supabase's pre-built Auth UI with redirect handling so you don't need to build a login page.
- **Repository pattern** — `SupabaseRepository` is a typed CRUD class implementing the `DataRepository` interface from `@greenstones/qui-core`. Create one per table; it handles create, read, update, and delete with composable primary-key support.
- **Table hooks** — `useSupabaseTable` returns a `ListData` object (pagination, sorting, filtering) compatible with `@greenstones/qui-bootstrap`'s `QuickTable` and `ListPage` components — no glue code required.
- **Query hook** — `useSupabaseQuery` wraps any Supabase query builder in a memoised async hook.
- **Edge Function hook** — `useSupabaseFunction` invokes a Supabase Edge Function and surfaces HTTP errors cleanly.
- **Typed repositories** — `useSupabaseTypedRepository` accepts Supabase-generated database types and infers `Row`, `Insert`, and `Update` shapes automatically.

---

## Installation

```bash
bun add @greenstones/qui-supabase
```

Install peer dependencies if not already present:

```bash
bun add @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared \
            date-fns react react-dom
```

---

## Quick Start

```tsx
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter } from 'react-router-dom';
import { Supabase, useSupabaseTable, useSupabaseRepository } from '@greenstones/qui-supabase';

// 1. Create Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ANON_KEY,
);

// 2. Wrap your app
export function App() {
  return (
    <BrowserRouter>
      <Supabase
        client={supabase}
        authProps={{ loginPath: '/login', afterLoginPath: '/dashboard' }}
      >
        <AppRoutes />
      </Supabase>
    </BrowserRouter>
  );
}

// 3. Fetch a typed table with pagination
interface Task { id: string; title: string; done: boolean }

function TaskListPage() {
  const listData = useSupabaseTable<Task>('tasks', {
    paging: true,
    pageSize: 20,
  });

  return (
    <ul>
      {listData.data?.items.map(t => <li key={t.id}>{t.title}</li>)}
    </ul>
  );
}

// 4. CRUD via repository
function useTaskRepository() {
  return useSupabaseRepository<Task>('tasks');
}
```

---

## API Documentation

### Table of Contents

| Module | Description |
|--------|-------------|
| [Context](#context) | Supabase client context, provider, and client factory helpers |
| [Supabase](#supabase-root) | Root wrapper component combining context and auth |
| [auth](#auth) | Authentication provider, auth UI component, role helpers |
| [data/repository](#datarepository) | `SupabaseRepository` CRUD class and repository hooks |
| [data/table](#datatable) | Paginated/sorted table hooks compatible with `ListData` |
| [data/query](#dataquery) | General-purpose Supabase query hook |
| [data/function](#datafunction) | Supabase Edge Function invocation hook |
| [data/utils](#datautils) | Low-level CRUD utility functions |
| [data/types](#datatypes) | `Identifiable` interface |

---

### Context

#### `SupabaseContextProvider`

Provides the Supabase client to all descendant components through React context.

```ts
function SupabaseContextProvider(props: {
  client: SupabaseClient;
  children: ReactNode;
}): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `client` | `SupabaseClient` | **yes** | Supabase JS client instance |
| `children` | `ReactNode` | **yes** | Component tree |

```tsx
import { createClient } from '@supabase/supabase-js';
import { SupabaseContextProvider } from '@greenstones/qui-supabase';

const client = createClient(url, anonKey);

<SupabaseContextProvider client={client}>
  <App />
</SupabaseContextProvider>
```

---

#### `useSupabaseClient`

Returns the Supabase client from context. Accepts an optional explicit client that takes precedence over the context value. Throws if neither is available.

```ts
function useSupabaseClient(client?: SupabaseClient): SupabaseClient
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `client` | `SupabaseClient` | no | Explicit client; overrides context value |

**Returns:** `SupabaseClient`

**Throws:** `Error("No Supabase Client defined.")` if no client is available.

```tsx
import { useSupabaseClient } from '@greenstones/qui-supabase';

function MyComponent() {
  const supabase = useSupabaseClient();
  // use supabase directly
}
```

---

#### `CreateReactApp`

Factory object for Create React App (CRA) projects. Reads `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_SERVICE_ANON_KEY` from `process.env`.

```ts
const CreateReactApp: {
  createSupabaseClient: () => SupabaseClient;
}
```

```ts
import { CreateReactApp } from '@greenstones/qui-supabase';

const client = CreateReactApp.createSupabaseClient();
```

---

#### `ViteApp`

Factory object for Vite projects. Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_SERVICE_ANON_KEY` from `import.meta.env`.

```ts
const ViteApp: {
  createSupabaseClient: () => SupabaseClient;
}
```

```ts
import { ViteApp } from '@greenstones/qui-supabase';

const client = ViteApp.createSupabaseClient();
```

**.env** (Vite):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_SERVICE_ANON_KEY=your-anon-key
```

---

### Supabase (root)

#### `Supabase`

Root wrapper component. Composes `SupabaseContextProvider` and `SupabaseAuth` into a single component. Use this at the app root.

```ts
interface SupabaseProps {
  client: SupabaseClient;
  authProps?: SupabaseAuthProps;
}

function Supabase(props: PropsWithChildren<SupabaseProps>): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `client` | `SupabaseClient` | **yes** | Supabase JS client |
| `authProps` | `SupabaseAuthProps` | no | Auth configuration (see [SupabaseAuth](#supabaseauth)) |
| `children` | `ReactNode` | **yes** | App tree |

```tsx
import { Supabase, ViteApp } from '@greenstones/qui-supabase';

const supabase = ViteApp.createSupabaseClient();

<BrowserRouter>
  <Supabase
    client={supabase}
    authProps={{
      loginPath: '/login',
      afterLoginPath: '/app',
      afterLogoutPath: '/',
    }}
  >
    <AppRoutes />
  </Supabase>
</BrowserRouter>
```

---

### `auth`

#### `SupabaseAuth`

Authentication state manager. Fetches the current session on mount, subscribes to Supabase auth state changes, and populates `AuthContext` from `@greenstones/qui-core` with user state and auth methods. Returns `null` while the initial session load is in progress.

```ts
interface SupabaseAuthProps extends BaseAuthProps {
  supabaseClient?: SupabaseClient;
  loginPath?: string;
}

function SupabaseAuth(props: PropsWithChildren<SupabaseAuthProps>): JSX.Element | null
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `supabaseClient` | `SupabaseClient` | no | Explicit client; falls back to context |
| `loginPath` | `string` | no | Path to redirect to for login (default: `'/login'`) |
| `afterLoginPath` | `string` | no | Redirect after successful login |
| `afterLogoutPath` | `string` | no | Redirect after sign-out (default: `'/'`) |
| `roleMapper` | `(user: any) => Promise<string[]>` | no | Async function that returns roles for the user |
| `children` | `ReactNode` | **yes** | App tree |

**`AuthContext` values provided:**

| Value | Type | Description |
|-------|------|-------------|
| `isAuthenticated` | `boolean` | Whether a session exists |
| `user` | `any` | Supabase user + session object |
| `userDisplayName` | `string` | User's email address |
| `token` | `string` | JWT access token |
| `login(returnTo?)` | `(returnTo?: string) => Promise<void>` | Navigate to login page |
| `logout(returnTo?)` | `(returnTo?: string) => Promise<void>` | Sign out and navigate |
| `loginWithPassword(email, password, returnTo?)` | `Promise<void>` | Email/password sign-in |
| `loginWithOAuth(provider, returnTo?)` | `Promise<void>` | OAuth sign-in redirect |
| `hasRole(role)` | `(role: string) => boolean` | Role check |

```tsx
import { SupabaseAuth, tableRoleMapper } from '@greenstones/qui-supabase';

<SupabaseAuth
  loginPath="/login"
  afterLoginPath="/dashboard"
  roleMapper={tableRoleMapper(supabase, 'user_roles')}
>
  <App />
</SupabaseAuth>
```

---

#### `SupabaseAuthUI`

Pre-built auth UI component wrapping Supabase's `@supabase/auth-ui-react` `Auth` component. Redirects authenticated users automatically. Reads `redirectTo` from React Router location state so the login flow preserves the intended destination.

```ts
function SupabaseAuthUI(props: {
  supabaseClient: SupabaseClient;
  providers?: string[];
}): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `supabaseClient` | `SupabaseClient` | **yes** | Supabase JS client |
| `providers` | `string[]` | no | OAuth providers to display (default: `['azure', 'bitbucket']`) |

```tsx
import { SupabaseAuthUI } from '@greenstones/qui-supabase';

// In your /login route component:
function LoginPage() {
  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <SupabaseAuthUI
        supabaseClient={supabase}
        providers={['google', 'github']}
      />
    </div>
  );
}
```

---

#### `tableRoleMapper`

Creates a role mapper function that fetches user roles from a Supabase table. Pass the result to `SupabaseAuth`'s `roleMapper` prop to enable role-based access control.

```ts
function tableRoleMapper(
  supabaseClient: SupabaseClient,
  table: string,
  roleColumn?: string,
): (user: any) => Promise<string[]>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `supabaseClient` | `SupabaseClient` | **yes** | Supabase JS client |
| `table` | `string` | **yes** | Table name to query for roles |
| `roleColumn` | `string` | no | Column containing the role value (default: `'role'`) |

**Returns:** Async function `(user) => Promise<string[]>` that queries the table for rows matching `user_id = user.id`.

```tsx
<SupabaseAuth roleMapper={tableRoleMapper(supabase, 'user_roles', 'role')}>
  <App />
</SupabaseAuth>
```

Required table structure:

```sql
create table user_roles (
  user_id uuid references auth.users(id),
  role    text not null
);
```

---

#### `hasOneOfRoles`

Checks if a `hasRole` function returns `true` for any role in the provided list.

```ts
function hasOneOfRoles(
  hasRole: (role: string) => boolean,
  roles: string[],
): boolean
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `hasRole` | `(role: string) => boolean` | **yes** | Role check function from `AuthContext` |
| `roles` | `string[]` | **yes** | Roles to check against |

**Returns:** `true` if the user has at least one of the given roles.

```tsx
import { hasOneOfRoles } from '@greenstones/qui-supabase';
import { useAuth } from '@greenstones/qui-core';

function AdminPanel() {
  const { hasRole } = useAuth();

  if (!hasOneOfRoles(hasRole, ['admin', 'superuser'])) {
    return <p>Access denied</p>;
  }
  return <AdminContent />;
}
```

---

### `data/repository`

#### `SupabaseRepository`

Generic CRUD repository class implementing the `DataRepository<T, Id, CreateType, UpdateType>` interface from `@greenstones/qui-core`. One instance per table.

```ts
class SupabaseRepository<
  T extends Record<string, any>,
  Id extends Record<string, any> = Identifiable,
  CreateType = Omit<T, keyof Id> & Partial<Id>,
  UpdateType = Partial<T>,
>
```

**Constructor**

```ts
new SupabaseRepository(
  supabase: SupabaseClient,
  tableName: string,
  primaryKeys?: (keyof Id)[],   // default: ['id']
)
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `supabase` | `SupabaseClient` | **yes** | Supabase JS client |
| `tableName` | `string` | **yes** | Table to operate on |
| `primaryKeys` | `(keyof Id)[]` | no | Primary key columns (default: `['id']`) |

**Methods**

| Method | Signature | Description |
|--------|-----------|-------------|
| `create` | `(item: CreateType) => Promise<T>` | Insert a row; returns the inserted row |
| `findById` | `(id: Id) => Promise<T>` | Fetch a single row by primary key(s) |
| `findAll` | `() => Promise<T[]>` | Fetch all rows |
| `update` | `(id: Id, item: UpdateType) => Promise<T>` | Update a row; returns the updated row |
| `delete` | `(id: Id) => Promise<boolean>` | Delete a row; returns `true` |

All methods throw on Supabase errors via `.throwOnError()`.

```tsx
import { SupabaseRepository } from '@greenstones/qui-supabase';

interface Task { id: string; title: string; done: boolean }

const repo = new SupabaseRepository<Task>(supabase, 'tasks');

const task    = await repo.create({ title: 'Write docs', done: false });
const found   = await repo.findById({ id: task.id });
const all     = await repo.findAll();
const updated = await repo.update({ id: task.id }, { done: true });
await repo.delete({ id: task.id });
```

**Composite primary key:**

```ts
interface OrderItem { order_id: string; product_id: string; qty: number }
type OrderItemId = Pick<OrderItem, 'order_id' | 'product_id'>;

const repo = new SupabaseRepository<OrderItem, OrderItemId>(
  supabase, 'order_items', ['order_id', 'product_id'],
);

await repo.delete({ order_id: '1', product_id: '42' });
```

---

#### `useSupabaseRepository`

React hook that creates a memoised `SupabaseRepository` instance using the client from context.

```ts
function useSupabaseRepository<
  T extends Id,
  Id extends Record<string, any> = { id: string },
  CreateType = Omit<T, keyof Id> & Partial<Id>,
  UpdateType = Partial<T>,
>(
  table: string,
  primaryKeys?: (keyof Id)[],
): SupabaseRepository<T, Id, CreateType, UpdateType>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `table` | `string` | **yes** | Table name |
| `primaryKeys` | `(keyof Id)[]` | no | Primary key columns (default: `['id']`) |

**Returns:** Memoised `SupabaseRepository` instance.

```tsx
import { useSupabaseRepository } from '@greenstones/qui-supabase';

interface Task { id: string; title: string; done: boolean }

function TaskPage() {
  const repo = useSupabaseRepository<Task>('tasks');

  const handleCreate = async () => {
    const task = await repo.create({ title: 'New task', done: false });
    console.log(task.id);
  };
}
```

---

#### `useSupabaseTypedRepository`

Strongly-typed variant that infers `Row`, `Insert`, and `Update` shapes from Supabase-generated database types (via `supabase gen types typescript`).

```ts
function useSupabaseTypedRepository<
  DatabaseType extends Database,
  TableType extends keyof DatabaseType['public']['Tables'],
  Identifiable extends Record<string, any> = { id: string },
>(
  table: string,
  primaryKeys?: (keyof Identifiable)[],
): SupabaseRepository<
  DatabaseType['public']['Tables'][TableType]['Row'] & Identifiable,
  Identifiable,
  DatabaseType['public']['Tables'][TableType]['Insert'],
  DatabaseType['public']['Tables'][TableType]['Update']
>
```

```ts
// Generated by: supabase gen types typescript > src/database.types.ts
import type { Database } from './database.types';
import { useSupabaseTypedRepository } from '@greenstones/qui-supabase';

const repo = useSupabaseTypedRepository<Database, 'tasks'>('tasks');

// Row, Insert, Update types are all inferred:
await repo.create({ title: 'Buy milk' });       // Insert shape
await repo.update({ id: '1' }, { done: true }); // Update shape
const task = await repo.findById({ id: '1' });  // Row shape
```

---

### `data/table`

#### `useSupabaseTable`

Hook that fetches a Supabase table with pagination, sorting, and optional filtering. Returns a `ListData` object compatible with `@greenstones/qui-bootstrap`'s `QuickTable`, `ListPage`, and `Paging` components.

```ts
function useSupabaseTable<Type, Query = string>(
  from: string,
  ops?: SupabaseSourceOptions<Query> & ListOptions<Query>,
): ListData<Type, Query>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | `string` | **yes** | Table name |
| `ops.select` | `string` | no | Columns to select (default: `'*'`) |
| `ops.filter` | `(qb: PostgrestFilterBuilder, query?: Query) => void` | no | Custom filter applied when `filtering` is active |
| `ops.supabaseClient` | `SupabaseClient` | no | Explicit client; overrides context |
| `ops.paging` | `boolean` | no | Enable pagination |
| `ops.pageSize` | `number` | no | Rows per page (default: `10`) |
| `ops.sorting` | `boolean` | no | Enable sorting |
| `ops.filtering` | `boolean` | no | Enable filtering (auto-enabled when `filter` fn is provided) |
| `ops.defaultQuery` | `Query` | no | Initial query value |

**Returns:** `ListData<Type, Query>` — data, paging controls, sorting state, query state, and `reload` function.

```tsx
import { useSupabaseTable } from '@greenstones/qui-supabase';

interface Task { id: string; title: string; done: boolean }
interface TaskQuery { search: string; showDone: boolean }

const listData = useSupabaseTable<Task, TaskQuery>('tasks', {
  paging: true,
  pageSize: 25,
  sorting: true,
  defaultQuery: { search: '', showDone: false },
  filter: (qb, query) => {
    if (query?.search)    qb.ilike('title', `%${query.search}%`);
    if (!query?.showDone) qb.eq('done', false);
  },
});
```

---

#### `useSupabaseTableQuery`

Alternative to `useSupabaseTable` with the same interface. Uses `useCallback` for the source function.

```ts
function useSupabaseTableQuery<Type, Query>(
  table: string,
  ops?: SupabaseSourceOptions<Query> & ListOptions<Query>,
): ListData<Type, Query>
```

---

#### `useSupabaseSource`

Lower-level hook returning a memoised `ListSource` function without executing it. Useful for manual composition.

```ts
function useSupabaseSource<Type, Query>(
  from: string,
  ops?: SupabaseSourceOptions<Query>,
): ListSource<Type, Query>
```

---

#### `createSupabaseSource`

Factory function that creates a `ListSource` outside of React (no hooks, no context).

```ts
function createSupabaseSource<Type, Query>(
  supabaseClient: SupabaseClient,
  from: string,
  ops?: SupabaseSourceOptions<Query>,
): ListSource<Type, Query>
```

```ts
import { createSupabaseSource } from '@greenstones/qui-supabase';

const source = createSupabaseSource<Task, TaskQuery>(supabase, 'tasks', {
  filter: (qb, q) => { if (q?.search) qb.ilike('title', `%${q.search}%`); },
});
```

---

#### `SupabaseSourceOptions`

```ts
interface SupabaseSourceOptions<Query> {
  supabaseClient?: SupabaseClient;
  select?: string;
  filter?: (
    queryBuilder: PostgrestFilterBuilder<any, any, any>,
    query?: Query,
  ) => void;
}
```

---

### `data/query`

#### `useSupabaseQuery`

General-purpose hook for any Supabase query. Wraps a query builder function with `useAsyncMemo` from `@greenstones/qui-core` and re-runs when `query` changes.

```ts
interface QueryFn<Type, Query> {
  (supabaseClient: SupabaseClient, query?: Query): Promise<Type>;
}

function useSupabaseQuery<Type = any, Query = any>(
  queryFn: (
    supabaseClient: SupabaseClient,
    query?: Query,
  ) => PostgrestFilterBuilder<any, any, any> | PostgrestBuilder<any>,
  query?: Query,
): UseAsyncMemoResult<Type>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `queryFn` | `(client, query?) => PostgrestFilterBuilder \| PostgrestBuilder` | **yes** | Function that returns a Supabase query builder |
| `query` | `Query` | no | Re-runs the hook when this value changes |

**Returns:** `{ data: Type \| undefined, loading: boolean, error: Error \| undefined, reload: () => void }`

```tsx
import { useSupabaseQuery } from '@greenstones/qui-supabase';

interface Stats { total: number; done: number }

function StatsWidget() {
  const { data, loading, error } = useSupabaseQuery<Stats[]>(
    (client) => client.from('task_stats').select('total, done'),
  );

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error.message}</p>;
  return <p>Total: {data?.[0]?.total}</p>;
}
```

---

### `data/function`

#### `useSupabaseFunction`

Hook for invoking a Supabase Edge Function. Returns an async trigger function. Catches `FunctionsHttpError` and re-throws as a plain `Error`.

```ts
function useSupabaseFunction(
  fn: string,
  options?: FunctionInvokeOptions,
): () => Promise<void>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `fn` | `string` | **yes** | Edge Function name |
| `options` | `FunctionInvokeOptions` | no | Invoke options: `method`, `body`, `headers` (default: `{ method: 'GET' }`) |

**Returns:** `() => Promise<void>` — throws `Error` on `FunctionsHttpError`.

```tsx
import { useSupabaseFunction } from '@greenstones/qui-supabase';
import { ActionButton } from '@greenstones/qui-bootstrap';

function SyncButton() {
  const syncData = useSupabaseFunction('sync-data', {
    method: 'POST',
    body: JSON.stringify({ force: true }),
    headers: { 'Content-Type': 'application/json' },
  });

  return (
    <ActionButton label="Sync" onClick={syncData} errorTitle="Sync failed" />
  );
}
```

---

### `data/utils`

Low-level async utility functions. All call `.throwOnError()` and throw a `PostgrestError` on failure.

#### `getById`

```ts
async function getById<Type>(
  supabaseClient: SupabaseClient,
  from: string,
  id: string,
): Promise<Type>
```

#### `update`

```ts
async function update<Type, ReturnType = Type>(
  supabaseClient: SupabaseClient,
  from: string,
  id: string,
  data: Type,
): Promise<ReturnType>
```

#### `insert`

```ts
async function insert<Type, ReturnType = Type>(
  supabaseClient: SupabaseClient,
  from: string,
  data: Type,
): Promise<ReturnType>
```

#### `remove`

```ts
async function remove<Type>(
  supabaseClient: SupabaseClient,
  from: string,
  id: string,
): Promise<Type>
```

```ts
import { getById, update, insert, remove } from '@greenstones/qui-supabase';

const task    = await getById<Task>(supabase, 'tasks', '123');
const created = await insert<Omit<Task,'id'>, Task>(supabase, 'tasks', { title: 'New', done: false });
const patched  = await update<Partial<Task>, Task>(supabase, 'tasks', created.id, { done: true });
await remove<Task>(supabase, 'tasks', created.id);
```

---

### `data/types`

#### `Identifiable`

Base interface for entities with an `id` property. Default ID type is `string`.

```ts
interface Identifiable<Type = string> {
  id: Type;
}
```

```ts
import type { Identifiable } from '@greenstones/qui-supabase';

interface Task extends Identifiable { title: string; done: boolean }
interface Product extends Identifiable<number> { name: string; price: number }
```

---

## Advanced Usage

### Full CRUD list page with `@greenstones/qui-bootstrap`

```tsx
import {
  useSupabaseTable,
  useSupabaseRepository,
} from '@greenstones/qui-supabase';
import {
  Page, QuickTable, Paging,
  useListActions, ListItemButtons,
  InputField, CheckField,
  ModalFormControllerProps,
} from '@greenstones/qui-bootstrap';

interface Task { id: string; title: string; done: boolean }
interface TaskQuery { search: string }

function TaskFormFields(_: ModalFormControllerProps<Omit<Task, 'id'>>) {
  return (
    <>
      <InputField<Omit<Task, 'id'>> name="title" label="Title" ops={{ required: true }} />
      <CheckField<Omit<Task, 'id'>> name="done"  label="Done" />
    </>
  );
}

export function TaskListPage() {
  const repository = useSupabaseRepository<Task>('tasks');
  const listData   = useSupabaseTable<Task, TaskQuery>('tasks', {
    paging: true,
    pageSize: 20,
    defaultQuery: { search: '' },
    filter: (qb, q) => { if (q?.search) qb.ilike('title', `%${q.search}%`); },
  });
  const actions = useListActions<Task, Task>({
    repository,
    modal: TaskFormFields,
    onSuccess: listData.reload,
    createTitle: 'New Task',
    editTitle: 'Edit Task',
    deleteTitle: 'Delete Task?',
  });

  return (
    <Page header="Tasks">
      <button className="btn btn-primary mb-3" onClick={actions.create}>+ New Task</button>
      <QuickTable<Task>
        items={listData.data?.items ?? []}
        hover
        columns={[
          { header: 'Title', render: t => t.title },
          { header: 'Done',  render: t => t.done ? 'Yes' : 'No' },
          { header: '',      render: t => <ListItemButtons entity={t} actions={actions} size="sm" /> },
        ]}
      />
      <Paging paging={listData.paging} hideOnSinglePage />
    </Page>
  );
}
```

---

### Role-based access control

```tsx
import { Supabase, tableRoleMapper, hasOneOfRoles } from '@greenstones/qui-supabase';
import { useAuth } from '@greenstones/qui-core';
import { Navigate } from 'react-router-dom';

// App root
<Supabase
  client={supabase}
  authProps={{ roleMapper: tableRoleMapper(supabase, 'user_roles') }}
>
  <App />
</Supabase>

// Protected route
function AdminRoute() {
  const { hasRole } = useAuth();
  if (!hasOneOfRoles(hasRole, ['admin', 'owner'])) return <Navigate to="/" />;
  return <AdminPage />;
}
```

---

### Strongly-typed repository with generated types

```bash
npx supabase gen types typescript --project-id your-project-id > src/database.types.ts
```

```ts
import type { Database } from './database.types';
import { useSupabaseTypedRepository } from '@greenstones/qui-supabase';

const repo = useSupabaseTypedRepository<Database, 'tasks'>('tasks');

await repo.create({ title: 'Buy milk' });          // enforces Insert type
await repo.update({ id: '1' }, { done: true });    // enforces Update type
const task = await repo.findById({ id: '1' });     // returns Row type
```

---

### Custom query with joins

```tsx
import { useSupabaseQuery } from '@greenstones/qui-supabase';

interface TaskWithUser {
  id: string;
  title: string;
  user: { email: string };
}

const { data } = useSupabaseQuery<TaskWithUser[]>(
  (client) =>
    client
      .from('tasks')
      .select('id, title, user:users(email)')
      .eq('done', false)
      .order('created_at', { ascending: false }),
);
```

---

## TypeScript

### Generic repository type parameters

```ts
class SupabaseRepository<
  T extends Record<string, any>,                    // Full row type
  Id extends Record<string, any> = Identifiable,   // Primary key shape
  CreateType = Omit<T, keyof Id> & Partial<Id>,    // Insert payload
  UpdateType = Partial<T>,                          // Update payload
>
```

Restrict payloads explicitly:

```ts
interface Task { id: string; title: string; createdAt: string }
type TaskCreate = Pick<Task, 'title'>;
type TaskUpdate = Pick<Task, 'title'>;

const repo = new SupabaseRepository<Task, Identifiable, TaskCreate, TaskUpdate>(
  supabase, 'tasks',
);
```

### Typed filter callbacks

The `filter` function receives your `Query` type — TypeScript will enforce it:

```ts
interface TaskQuery { search: string; assigneeId: string | null }

useSupabaseTable<Task, TaskQuery>('tasks', {
  filter: (qb, query: TaskQuery | undefined) => {
    if (query?.search)     qb.ilike('title', `%${query.search}%`);
    if (query?.assigneeId) qb.eq('assignee_id', query.assigneeId);
  },
});
```

### `Identifiable` variants

```ts
import type { Identifiable } from '@greenstones/qui-supabase';

interface User    extends Identifiable         { name: string }          // id: string
interface Product extends Identifiable<number> { name: string }          // id: number
// Composite key — define your own shape, don't extend Identifiable
interface OrderItem { order_id: string; product_id: string; qty: number }
```

---

## Configuration

### `Supabase` / `SupabaseAuth`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `loginPath` | `string` | `'/login'` | Route to navigate to for login |
| `afterLoginPath` | `string` | `undefined` | Redirect after successful login |
| `afterLogoutPath` | `string` | `'/'` | Redirect after sign-out |
| `roleMapper` | `(user: any) => Promise<string[]>` | `undefined` | Async role resolver |

### `useSupabaseTable` / `SupabaseSourceOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `select` | `string` | `'*'` | PostgREST column selector |
| `filter` | `(qb, query?) => void` | `undefined` | Custom filter function |
| `paging` | `boolean` | `false` | Enable pagination |
| `pageSize` | `number` | `10` | Rows per page |
| `sorting` | `boolean` | `false` | Enable column sorting |
| `filtering` | `boolean` | auto | Enable filter; auto-enabled when `filter` fn is provided |
| `defaultQuery` | `Query` | `undefined` | Initial query value |
| `supabaseClient` | `SupabaseClient` | context | Explicit client override |

### `useSupabaseFunction`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | `'GET'` | HTTP method |
| `body` | `BodyInit` | `undefined` | Request body |
| `headers` | `Record<string, string>` | `undefined` | Additional headers |

### Environment variables

| Variable | Framework | Description |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | Vite | Supabase project URL |
| `VITE_SUPABASE_SERVICE_ANON_KEY` | Vite | Supabase anon/public key |
| `REACT_APP_SUPABASE_URL` | CRA | Supabase project URL |
| `REACT_APP_SUPABASE_SERVICE_ANON_KEY` | CRA | Supabase anon/public key |

---

## Error Handling

### Repository / util functions

All methods call `.throwOnError()`. A Supabase error is thrown as `PostgrestError`:

```ts
try {
  const task = await repo.findById({ id: '999' });
} catch (e) {
  // PostgrestError: { message, details, hint, code }
  console.error((e as PostgrestError).message);
}
```

### `useSupabaseFunction`

`FunctionsHttpError` is caught internally and re-thrown as `Error` with the response body appended:

```ts
try {
  await invokeEdgeFunction();
} catch (e) {
  console.error((e as Error).message); // "Es ist ein Fehler aufgetreten. <body>"
}
```

### `loginWithPassword`

Throws a Supabase `AuthError` directly on sign-in failure:

```ts
try {
  await loginWithPassword(email, password);
} catch (e) {
  setFieldError((e as AuthError).message);
}
```

### `useSupabaseQuery`

Check the `error` field in the returned object:

```tsx
const { data, loading, error } = useSupabaseQuery<Task[]>(
  (client) => client.from('tasks').select(),
);

if (error) return <p>Error: {error.message}</p>;
```

---

## Contributing

### Setup

```bash
# Clone the monorepo
git clone <repo-url>
cd react-qui

# Install all dependencies
bun install

# Build qui-core first
cd packages/qui-core && bun run build && cd ../..

# Start Storybook for qui-supabase
cd packages/qui-supabase
bun run storybook      # http://localhost:6006
bun run build          # Production build → dist/
bun run watch          # Watch mode
bun run lint           # ESLint
```

### Local end-to-end testing

```bash
# Publish all packages to local Verdaccio (localhost:4873)
bun run pub-local            # from monorepo root

# Or publish only qui-supabase
bun run pub-local-supabase
```

### PR guide

1. Fork and create a feature branch: `git checkout -b feat/my-feature`
2. Add or update Storybook stories alongside the source file
3. Run `bun run lint` — all lint rules must pass
4. Run `bun run build` — must succeed with no TypeScript errors
5. Open a pull request against `main`

> There is no automated test suite. Behaviour is verified via Storybook stories and manual testing against a Supabase project.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full release history.

---

## License

MIT © Greenstones GmbH
