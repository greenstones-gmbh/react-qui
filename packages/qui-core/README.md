# @greenstones/qui-core

Reusable high-level components for authentication, secure routing, list and detail views, and modal management. No styling opinions.

[![npm version](https://img.shields.io/npm/v/@greenstones/qui-core)](https://www.npmjs.com/package/@greenstones/qui-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Why this library

Building React applications requires solving the same problems repeatedly: authentication state, paginated/sortable/filterable lists, async data loading, modal management, and table column definitions. `@greenstones/qui-core` provides:


- **Auth out of the box** — `SimpleAuth` covers demos and prototypes; swap in any provider by implementing `IAuthContext`. Role-based guards and auth-aware nav links are included.
- **Auth-ready routing** — `AuthContext`, `Guard`, and `AppRoutes` wire up protected routes without locking you into an auth provider.
- **Batteries-included list management** — `useList` and `useArray` handle paging, sorting, and filtering with a single composable source interface.
- **Structured detail views** — `DetailModelBuilder` lets you define block-based detail layouts declaratively; auto-generate them from any object or compose them field by field.
- **Zero styling** — No CSS framework dependency. Pair with `@greenstones/qui-bootstrap` or bring your own components.

---

## Installation

```bash
bun add @greenstones/qui-core
```

### Peer dependencies

```bash
bun install react react-dom react-router-dom date-fns file-saver
```

---

## Quick Start

```tsx
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  SimpleAuth,
  ModalContextProvider,
  AppRoutes,
  useAuth,
  useArray,
  useColumnBuilder,
  useDetaiModelBuilder,
} from '@greenstones/qui-core';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

const users: User[] = [
  { id: 1, firstName: 'Alice', lastName: 'Martin',  email: 'alice@example.com',  department: 'Engineering' },
  { id: 2, firstName: 'Bob',   lastName: 'Chen',    email: 'bob@example.com',    department: 'Design' },
  { id: 3, firstName: 'Carol', lastName: 'Schmidt', email: 'carol@example.com',  department: 'Marketing' },
];

// 1. Wrap your app with auth + modal providers
function App() {
  return (
    <BrowserRouter>
      <SimpleAuth loginPath="/login" afterLoginPath="/users">
        <ModalContextProvider>
          <AppRoutes
            login={<LoginPage />}
            protected={
              <>
                <Route path="/users"    element={<UserListPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
              </>
            }
          />
        </ModalContextProvider>
      </SimpleAuth>
    </BrowserRouter>
  );
}

// 2. List page — paginated table with four columns
function UserListPage() {
  const { items } = useArray(users);

  const columns = useColumnBuilder<User>((b) =>
    b.column('firstName',  { header: 'First Name', linkTo: (u) => `/users/${u.id}` })
     .column('lastName',   { header: 'Last Name' })
     .column('email',      { header: 'Email' })
     .column('department', { header: 'Department' })
  , []);

  return (
    <table>
      <thead>
        <tr>{columns.map((c) => <th key={c.header}>{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {items?.map((user) => (
          <tr key={user.id}>
            {columns.map((c) => <td key={c.header}>{c.render(user)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


// 3. Detail page — block-based detail view
function UserDetailPage({ user }: { user?: User }) {
  const detail = useDetaiModelBuilder<User>((b) =>
    b.line({ label: 'First Name',  getter: (u) => u.firstName })
     .line({ label: 'Last Name',   getter: (u) => u.lastName })
     .line({ label: 'Email',       getter: (u) => u.email })
     .separator()
     .line({ label: 'Department',  getter: (u) => u.department })
  );

  return (
    <>
      {detail.blocks.map((block, bi) => (
        <dl key={bi}>
          {block.lines.map((field, li) =>
            field ? (
              <div key={li}>
                <dt>{field.label}</dt>
                <dd>{user && field.render(user)}</dd>
              </div>
            ) : <hr key={li} />
          )}
        </dl>
      ))}
    </>
  );
}


// 4. Login page — uses loginWithPassword from auth context
function LoginPage() {
  const { loginWithPassword } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithPassword?.(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Sign in</button>
    </form>
  );
}
```

---

## API Documentation

| Module | Description |
|---|---|
| [auth](#auth) | Auth context, route guards, role checks, and a built-in simple provider |
| [components](#components) | Utility display components (`DateFormatter`, `LabelMapper`) |
| [fields](#fields) | Typed field and column abstractions for rendering entity properties |
| [hooks](#hooks) | Async data, list/paging/sorting/filtering, selection, and fetch hooks |
| [models](#models) | Fluent builder for block-based detail view layouts |
| [modals](#modals) | Global modal stack context and provider |
| [utils](#utils) | CSV export utilities |
| [entity](#entity) | Generic CRUD handler interface |
| [data](#data) | Generic async repository interface and type utilities |

---

### auth

The auth module provides a React context for authentication state, route protection utilities, and a lightweight built-in provider.

---

#### `AuthContext`

```ts
const AuthContext: React.Context<IAuthContext>
```

The underlying React context. Use `useAuth()` to consume it.

---

#### `IAuthContext`

The shape of the auth context value.

```ts
interface IAuthContext {
  user?: any;
  userDisplayName?: string;
  isAuthenticated: boolean;
  token?: string;
  roles?: string[];
  afterLoginPath?: string;
  afterLogoutPath?: string;

  login(returnTo?: string): Promise<void>;
  logout(returnTo?: string): Promise<void>;
  loginWithPassword?(username: string, password: string, returnTo?: string): Promise<void>;
  loginWithOAuth?(provider: string, returnTo?: string): Promise<void>;
  hasRole(role: string): boolean;
}
```

| Field | Type | Description |
|---|---|---|
| `user` | `any` | Raw user object from the auth provider |
| `userDisplayName` | `string` | Human-readable display name |
| `isAuthenticated` | `boolean` | Whether there is an authenticated session |
| `token` | `string` | Access token for API calls |
| `roles` | `string[]` | Resolved roles for the current user |
| `login` | `(returnTo?) => Promise<void>` | Navigate to login, optionally with a redirect-back path |
| `logout` | `(returnTo?) => Promise<void>` | Clear session and navigate away |
| `loginWithPassword` | `(username, password, returnTo?) => Promise<void>` | Credential-based login |
| `loginWithOAuth` | `(provider, returnTo?) => Promise<void>` | OAuth provider login |
| `hasRole` | `(role: string) => boolean` | Check if the current user has a role |

---

#### `useAuth`

```ts
function useAuth(): IAuthContext
```

Hook to consume the auth context. Must be used inside an `AuthContext.Provider`.

```tsx
import { useAuth } from '@greenstones/qui-core';

function ProfileBadge() {
  const { userDisplayName, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return null;
  return <span onClick={() => logout()}>{userDisplayName}</span>;
}
```

---

#### `Guard`

```ts
function Guard(props: {
  children?: React.ReactNode;
  redirectToLogin?: boolean;  // default: true
  role?: string;
}): JSX.Element
```

Protects a subtree. Redirects unauthenticated users to login; optionally enforces a role.

| Prop | Type | Required | Description |
|---|---|---|---|
| `children` | `ReactNode` | No | Protected content |
| `redirectToLogin` | `boolean` | No | Redirect to login when not authenticated (default `true`) |
| `role` | `string` | No | If set, user must have this role to see children |

```tsx
<Guard role="admin">
  <AdminPanel />
</Guard>
```

---

#### `NavLink`

```ts
function NavLink(props: NavLinkProps & {
  allowedRoles?: string;
  authenticated?: boolean;
}): JSX.Element | null
```

A role/auth-aware navigation link. Returns `null` when the user doesn't meet the requirements.

| Prop | Type | Required | Description |
|---|---|---|---|
| `authenticated` | `boolean` | No | Only render when user is authenticated |
| `allowedRoles` | `string` | No | Only render when user has this role |
| `...NavLinkProps` | — | — | All standard `react-router-dom` NavLink props |

```tsx
<NavLink to="/admin" allowedRoles="admin">Admin</NavLink>
<NavLink to="/profile" authenticated>My Profile</NavLink>
```

---

#### `SimpleAuth`

```ts
interface SimpleAuthProps {
  loginPath: string;            // required — path to login page
  afterLoginPath?: string;      // default: "/"
  afterLogoutPath?: string;
  roleMapper?: (user: any) => Promise<string[]>;
}

function SimpleAuth(props: PropsWithChildren<SimpleAuthProps>): JSX.Element
```

A lightweight auth provider for demos and prototypes. Stores a plain user object in React state; no external auth service required.

| Prop | Type | Required | Description |
|---|---|---|---|
| `loginPath` | `string` | Yes | Route path for the login page |
| `afterLoginPath` | `string` | No | Redirect target after successful login (default `/`) |
| `afterLogoutPath` | `string` | No | Redirect target after logout |
| `roleMapper` | `(user) => Promise<string[]>` | No | Async function that returns roles for a user |

```tsx
<SimpleAuth
  loginPath="/login"
  afterLoginPath="/dashboard"
  roleMapper={async (user) => user.roles}
>
  <App />
</SimpleAuth>
```

---

#### `AppRoutes`

```ts
function AppRoutes(props: {
  public?: React.ReactNode;
  protected?: React.ReactNode;
  layout?: React.ReactNode;    // default: <Outlet />
  login?: React.ReactNode;
  loginPath?: string;          // default: "login"
}): JSX.Element
```

Opinionated route structure combining public routes, login route, and `Guard`-wrapped protected routes with an optional shared layout.

| Prop | Type | Required | Description |
|---|---|---|---|
| `public` | `ReactNode` | No | Public `<Route>` elements |
| `protected` | `ReactNode` | No | Protected `<Route>` elements (wrapped in `Guard`) |
| `layout` | `ReactNode` | No | Shared layout wrapper (default `<Outlet />`) |
| `login` | `ReactNode` | No | Login page element |
| `loginPath` | `string` | No | Path segment for the login route (default `"login"`) |

```tsx
<AppRoutes
  loginPath="login"
  login={<LoginPage />}
  layout={<AppShell />}
  public={<Route path="/about" element={<AboutPage />} />}
  protected={
    <>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
    </>
  }
/>
```

---

#### `useRoles`

```ts
function useRoles(
  user: any,
  roleMapper?: (user: any) => Promise<string[]>
): { roles: string[] | undefined; hasRole: (role: string) => boolean }
```

Async hook that resolves roles from a user object via the provided mapper function.

---

#### `testRoleMapper`

```ts
function testRoleMapper(roles: string[]): (user: any) => Promise<string[]>
```

Creates a role mapper that always returns the given roles — useful in tests and Storybook.

```ts
const mapper = testRoleMapper(['admin', 'editor']);
// mapper(anyUser) => Promise.resolve(['admin', 'editor'])
```

---

### components

#### `DateFormatter`

```ts
function DateFormatter(props: {
  isoString?: string;
  type?: 'date' | 'time' | 'datetime';  // default: 'datetime'
  formatStr?: string;
}): JSX.Element | null
```

Formats an ISO 8601 date string using `date-fns`. Returns `null` when `isoString` is empty.

| Prop | Type | Required | Description |
|---|---|---|---|
| `isoString` | `string` | No | ISO 8601 date string to format |
| `type` | `'date' \| 'time' \| 'datetime'` | No | Preset format (default `'datetime'`) |
| `formatStr` | `string` | No | Custom `date-fns` format string — overrides `type` |

Built-in formats:

| `type` | Pattern | Example |
|---|---|---|
| `date` | `dd.MM.yyyy` | `31.12.2024` |
| `time` | `HH:mm` | `14:30` |
| `datetime` | `dd.MM.yyyy HH:mm` | `31.12.2024 14:30` |

```tsx
<DateFormatter isoString="2024-12-31T14:30:00Z" type="date" />
// → 31.12.2024

<DateFormatter isoString="2024-12-31T14:30:00Z" formatStr="MMM d, yyyy" />
// → Dec 31, 2024
```

---

#### `LabelMapper`

```ts
function LabelMapper<Value extends string | number>(props: {
  value: Value;
  mapper?: (v: Value) => ReactNode;
  values?: { [key in Value]: ReactNode };
}): JSX.Element
```

Maps a value to a label using either a function or a lookup object. Falls back to rendering the value directly.

| Prop | Type | Required | Description |
|---|---|---|---|
| `value` | `string \| number` | Yes | The value to map |
| `mapper` | `(v: Value) => ReactNode` | No | Function-based mapper |
| `values` | `Record<Value, ReactNode>` | No | Object lookup map |

```tsx
// With object map
<LabelMapper
  value="active"
  values={{ active: <Badge color="green">Active</Badge>, inactive: 'Inactive' }}
/>

// With function
<LabelMapper
  value={status}
  mapper={(s) => s === 'active' ? '✅' : '❌'}
/>
```

---

### fields

The fields module provides a typed abstraction for rendering entity properties — decoupling "what to render" from "where to render it".

---

#### `Field<EntityType>`

```ts
interface Field<EntityType> {
  label: string;
  render(value: EntityType): JSX.Element;
  renderString(value: EntityType): string | undefined;
}
```

Core field interface. `render` produces a React element; `renderString` is used for CSV export and plain-text contexts.

---

#### `createField`

```ts
function createField<EntityType, PropType>(
  options?: FieldOptions<EntityType, PropType>
): Field<EntityType>
```

Creates a field from options.

```ts
interface FieldOptions<EntityType, PropType> {
  label?: string;
  getter?: (value: EntityType) => PropType | undefined;
  renderField?: (field: PropType, entity: EntityType) => JSX.Element;
  linkTo?: (entity: EntityType) => string;
}
```

| Option | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | No | Column/field header label |
| `getter` | `(entity) => PropType` | No | Extract the value from the entity |
| `renderField` | `(value, entity) => JSX.Element` | No | Custom renderer for the extracted value |
| `linkTo` | `(entity) => string` | No | Wrap the value in a `<Link>` to this path |

```ts
import { createField, FieldRenderers } from '@greenstones/qui-core';

interface Order { id: number; createdAt: string; total: number; }

const totalField = createField<Order, number>({
  label: 'Total',
  getter: (o) => o.total,
  renderField: (total) => <strong>${total.toFixed(2)}</strong>,
});

const dateField = createField<Order, string>({
  label: 'Created',
  getter: (o) => o.createdAt,
  renderField: FieldRenderers.asIsoDate('date'),
});
```

---

#### `createFieldByProp`

```ts
function createFieldByProp<EntityType, PropType>(
  prop: keyof EntityType,
  options?: FieldRenderOptions<EntityType, PropType>
): Field<EntityType>
```

Shorthand for creating a field that reads a direct property by key.

```ts
const nameField = createFieldByProp<User, string>('name', {
  label: 'Full Name',
  linkTo: (u) => `/users/${u.id}`,
});
```

---

#### `createFieldByNestedProp`

```ts
function createFieldByNestedProp<EntityType, PropType>(
  prop: string,
  options?: FieldRenderOptions<EntityType, PropType>
): Field<EntityType>
```

Creates a field from a dot-notation path for nested properties.

```ts
const cityField = createFieldByNestedProp<Order, string>('address.city', {
  label: 'City',
});
// Reads order.address.city
```

---

#### `Fields`

Convenience namespace combining all field factories.

```ts
const Fields = {
  create: createField,
  byProp: createFieldByProp,
  byNestedProp: createFieldByNestedProp,
};
```

---

#### `FieldRenderers`

```ts
const FieldRenderers = {
  asIsoDate: (type?: 'date' | 'time' | 'datetime') => RenderFieldFunction<any, string>
}
```

Pre-built render functions for common field types.

```ts
const dateCol = createFieldByProp<Event, string>('startDate', {
  renderField: FieldRenderers.asIsoDate('date'),
});
```

---

#### `Column<EntityType>`

```ts
interface Column<EntityType> {
  header?: string;
  width?: number | string;
  sortKey?: string;
  className?: string | ((entity: EntityType) => string | undefined);
  headerClassName?: string;
  render(entity: EntityType): JSX.Element;
  renderString(value: EntityType): string | undefined;
}
```

A `Field` extended with table-specific metadata.

---

#### `createColumns`

```ts
function createColumns<Type>(
  configurer?: (builder: ColumnBuilder<Type>) => void
): Column<Type>[]
```

Builds a column array using the fluent `ColumnBuilder` API.

```ts
interface Product { id: number; name: string; price: number; category: string; }

const columns = createColumns<Product>((b) =>
  b.column('name', { header: 'Product Name', sortKey: 'name' })
   .column('price', {
     header: 'Price',
     renderField: (price: number) => <>${price.toFixed(2)}</>,
   })
   .column('category', { header: 'Category', width: 120 })
);
```

---

#### `ColumnBuilder<Type>`

Fluent builder returned by `createColumns`.

| Method | Signature | Description |
|---|---|---|
| `.column(prop, options?)` | `(prop: keyof Type, options?) => this` | Add a column for a typed property key |
| `.prop(prop, options?)` | `(prop: string, options?) => this` | Add a column for a dot-notation path |
| `.label(label, options?)` | `(label: string, options?) => this` | Add a column with a custom label and getter |
| `.field(field, options)` | `(field: Field<Type>, options) => this` | Add a column from an existing `Field` |
| `.add(column)` | `(col: Column<Type>) => this` | Add a pre-built column directly |

---

#### `useColumnBuilder`

```ts
function useColumnBuilder<Type>(
  configurer: (builder: ColumnBuilder<Type>) => void,
  deps?: DependencyList
): Column<Type>[]
```

Memoized hook wrapper for `createColumns`. Re-runs only when `deps` change.

```ts
const columns = useColumnBuilder<User>(
  (b) => b.column('name').column('email'),
  []
);
```

---

#### `useColumnGenerator`

```ts
function useColumnGenerator<Type>(items: Type[] | undefined): Column<Type>[]
```

Auto-generates columns by inspecting the keys of the first item in the array. Useful for development/debugging.

---

#### `filterColumns`

```ts
function filterColumns<Type>(
  columns: Column<Type>[],
  excludeHeaders: string[]
): Column<Type>[]
```

Returns a filtered copy of the columns array, excluding any with headers in `excludeHeaders`.

```ts
const visibleColumns = filterColumns(columns, ['Internal ID', 'Debug']);
```

---

### hooks

#### `useAsyncMemo`

The foundation hook for all async data fetching in the library.

```ts
function useAsyncMemo<T>(
  factory: (params?: any) => Promise<T> | undefined | null,
  deps: DependencyList
): AsyncMemoResult<T>

function useAsyncMemo<T>(
  factory: (params?: any) => Promise<T> | undefined | null,
  deps: DependencyList,
  initial: T
): AsyncMemoResult<T>
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `factory` | `(params?) => Promise<T>` | Yes | Async function to execute |
| `deps` | `DependencyList` | Yes | Re-runs factory when any dep changes |
| `initial` | `T` | No | Initial value before the first resolution |

**Returns `AsyncMemoResult<T>`:**

| Field | Type | Description |
|---|---|---|
| `data` | `T \| undefined` | Resolved value |
| `error` | `Error \| undefined` | Error if the promise rejected |
| `isError` | `boolean` | Whether an error occurred |
| `isSuccess` | `boolean` | Whether data was resolved |
| `isPending` | `boolean` | Whether the promise is in flight |
| `reload` | `(params?) => void` | Manually re-trigger the factory |
| `setData` | `(data: T \| undefined) => void` | Directly set data |

```tsx
import { useAsyncMemo } from '@greenstones/qui-core';

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isPending, error } = useAsyncMemo(
    () => fetchUser(userId),
    [userId]
  );

  if (isPending) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;
  return <div>{user?.name}</div>;
}
```

---

#### `useFetch`

```ts
function useFetch<Result = any>(
  url: string,
  init?: RequestInit,
  deps?: DependencyList
): AsyncMemoResult<Result>
```

HTTP JSON fetcher built on `useAsyncMemo`. Automatically injects a `Bearer` token from `sessionStorage['auth.access_token']` when present. On 401, clears the token and reloads the page.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | URL to fetch |
| `init` | `RequestInit` | No | Standard fetch options |
| `deps` | `DependencyList` | No | Additional dependencies (default `[]`) |

```ts
const { data: posts, isPending } = useFetch<Post[]>('/api/posts');
```

---

#### `fetchJson`

```ts
async function fetchJson<Result = any>(
  url: string,
  ops?: RequestInit & { skipToken?: boolean }
): Promise<Result>
```

The raw fetch helper used by `useFetch`. Can be called imperatively in event handlers. Set `skipToken: true` to skip auth header injection.

```ts
const user = await fetchJson<User>('/api/me');
const publicData = await fetchJson('/api/public', { skipToken: true });
```

---

#### `useList`

The core hook for paginated, sortable, filterable lists backed by any async data source.

```ts
function useList<Type, Query>(
  source: ListSource<Type, Query>,
  options?: ListOptions<Query>
): ListData<Type, Query>
```

**`ListSource<Type, Query>`** — async function that receives the current list state and returns items + page metadata:

```ts
type ListSource<Type, Query> = (state: ListState<Query>) => Promise<{
  items: Type[];
  meta: PageMeta;
}>
```

**`ListOptions<Query>`:**

| Option | Type | Default | Description |
|---|---|---|---|
| `paging` | `boolean` | `true` | Enable pagination |
| `sorting` | `boolean` | `true` | Enable sorting |
| `filtering` | `boolean` | `true` | Enable filtering |
| `initialPage` | `number` | `0` | Starting page index |
| `initialPageSize` | `number` | `20` | Starting page size |
| `initialQuery` | `Query` | — | Starting filter query |
| `initialSort` | `Sort` | — | Starting sort state |

**`ListData<Type, Query>` (returned):**

| Field | Type | Description |
|---|---|---|
| `items` | `Type[] \| undefined` | Current page items |
| `totalItems` | `number \| undefined` | Total matching items |
| `paging` | `ListPaging \| undefined` | Paging controls |
| `query` | `ListQuery<Query> \| undefined` | Filter state + input bindings |
| `sorting` | `ListSorting \| undefined` | Sort state + controls |
| `sourceData` | `AsyncMemoResult<...>` | Raw async memo state |

**`ListPaging`:**

| Field | Type | Description |
|---|---|---|
| `page` | `number` | Current 0-indexed page |
| `pageSize` | `number` | Items per page |
| `totalPages` | `number` | Total page count |
| `totalItems` | `number` | Total item count |
| `hasPrev` / `hasNext` | `boolean` | Navigation availability |
| `isFirst` / `isLast` | `boolean` | Boundary checks |
| `prev()` / `next()` / `first()` / `last()` | `() => void` | Navigation actions |
| `setPage(n)` | `(n: number) => void` | Jump to page |
| `setPageSize(n)` | `(n: number) => void` | Change page size |
| `pages(pagerSize?)` | `(n?: number) => ListPagerPage[]` | Window of page buttons |
| `pageString` | `string` | Human-readable page (1-indexed) |
| `rangeString` | `string` | e.g. `"1-20"` |

**`ListSorting`:**

| Field | Type | Description |
|---|---|---|
| `value` | `Sort \| undefined` | Current sort state |
| `setValue(sort)` | `(sort?) => void` | Set sort directly |
| `sortById(id)` | `(id: string) => void` | Toggle sort for a column id |
| `isActive(id)` | `(id: string) => boolean` | Whether column is sorted |
| `isActiveAndAsc(id)` | `(id: string) => boolean` | Sorted ascending |
| `isActiveAndDesc(id)` | `(id: string) => boolean` | Sorted descending |

**`ListQuery<Query>`:**

| Field | Type | Description |
|---|---|---|
| `value` | `Query \| undefined` | Current query object |
| `setValue(q)` | `(q?) => void` | Set query directly |
| `field(f)` | `(f: keyof Query) => Binding` | Input binding for a query field |
| `setField(f, v)` | `(f, v) => void` | Set a single query field |
| `bind()` | `() => Binding` | Binding for the whole query as a string |

```tsx
import { useList, ListSource } from '@greenstones/qui-core';

interface User { id: number; name: string; }
interface UserQuery { name?: string; }

const fetchUsers: ListSource<User, UserQuery> = async (state) => {
  const { page = 0, pageSize = 20, query } = state;
  const res = await fetch(`/api/users?page=${page}&pageSize=${pageSize}&name=${query?.name ?? ''}`);
  const { users, total } = await res.json();
  return {
    items: users,
    meta: createPageMeta(page, pageSize, total),
  };
};

function UserList() {
  const { items, paging, query, sorting } = useList(fetchUsers, {
    initialPageSize: 10,
  });

  return (
    <div>
      <input {...query?.field('name')} placeholder="Search by name..." />
      <table>
        <thead>
          <tr>
            <th onClick={() => sorting?.sortById('name')}>
              Name {sorting?.isActiveAndAsc('name') ? '↑' : '↓'}
            </th>
          </tr>
        </thead>
        <tbody>
          {items?.map((u) => <tr key={u.id}><td>{u.name}</td></tr>)}
        </tbody>
      </table>
      {paging && (
        <div>
          <button onClick={paging.prev} disabled={!paging.hasPrev}>Prev</button>
          <span>{paging.pageString} / {paging.totalPages}</span>
          <button onClick={paging.next} disabled={!paging.hasNext}>Next</button>
        </div>
      )}
    </div>
  );
}
```

---

#### `useArray`

```ts
function useArray<Type, Query = string>(
  array: Type[] | undefined,
  options?: ArraySourceOptions<Type, Query> & ListOptions<Query>
): ListData<Type, Query>
```

Wraps a plain array as a `ListSource` with client-side filtering and sorting.

```ts
interface ArraySourceOptions<Type, Query> {
  filter?: Filter<Type, Query>;   // client-side filter factory
  sorter?: Sorter<Type>;          // client-side sort comparator factory
}
```

```tsx
import { useArray, Filters, Sorters } from '@greenstones/qui-core';

function ProductList({ products }: { products: Product[] }) {
  const { items, paging, query } = useArray(products, {
    filter: Filters.like('name'),
    sorter: Sorters.objectProps(),
    initialPageSize: 5,
  });
  // ...
}
```

---

#### Filter utilities

```ts
// Combine filters
Filters.and<Type, Query>(...filters: Filter<Type, Query>[]): Filter<Type, Query>
Filters.or<Type, Query>(...filters: Filter<Type, Query>[]): Filter<Type, Query>

// Built-in filters
Filters.like<Type, Query>(prop: keyof Type, queryProp?: keyof Query): Filter<Type, Query>
Filters.isEq<Type, Query>(prop: keyof Type, queryProp?: keyof Query): Filter<Type, Query>
Filters.objectContains<Query>(queryProp?: keyof Query): Filter<any, Query>
Filters.isSatisfiedBy<Type, Query>(fn: (value: Type, query?: Query) => boolean): Filter<Type, Query>
```

| Filter | Description |
|---|---|
| `like` | Case-insensitive substring match on a property |
| `isEq` | Strict equality match on a property |
| `objectContains` | Substring match against the entire JSON-stringified object |
| `isSatisfiedBy` | Arbitrary predicate |
| `and` | All filters must pass |
| `or` | At least one filter must pass |

---

#### `useOne`

```ts
function useOne<Type, Query>(
  source: ResourceSource<Type, Query>,
  query: Query
): { data?: Type; error?: Error }
```

Fetches a single resource. Re-fetches when `query` changes.

```ts
const { data: user } = useOne(
  (id: number) => fetchJson(`/api/users/${id}`),
  userId
);
```

---

#### `useSelection`

```ts
function useSelection<Type>(
  singleMode?: boolean,       // default: true
  rowAction?: (v: Type) => void,
  deps?: DependencyList
): Selection<Type>
```

Manages list selection with click handling. In `singleMode`, only one item can be selected at a time. Multi-select is enabled via Ctrl/Cmd+click. Double-click triggers `rowAction`.

**Returns `Selection<Type>`:**

| Field | Type | Description |
|---|---|---|
| `selectedItems` | `Type[]` | Currently selected items |
| `setSelectedItems` | `(items: Type[] \| undefined) => void` | Manually set selection |
| `onItemClick` | `(item: Type, e: MouseEvent) => void` | Click handler |
| `isSelected` | `(item: Type) => boolean` | Whether an item is selected |

```tsx
function DataTable<T>({ items }: { items: T[] }) {
  const { isSelected, onItemClick } = useSelection<T>(
    true,
    (item) => console.log('open', item)
  );

  return (
    <table>
      {items.map((item, i) => (
        <tr
          key={i}
          className={isSelected(item) ? 'selected' : ''}
          onClick={(e) => onItemClick(item, e)}
        >
          ...
        </tr>
      ))}
    </table>
  );
}
```

---

#### `createPageMeta`

```ts
function createPageMeta(
  page: number,
  pageSize: number,
  totalItems: number
): PageMeta
```

Utility for constructing `PageMeta` in custom `ListSource` implementations.

```ts
const meta = createPageMeta(0, 20, 147);
// { page: 0, range: { start: 0, end: 20 }, totalItems: 147, totalPages: 8 }
```

---

#### `createSinglePage`

```ts
function createSinglePage<Type>(items: Type[]): { items: Type[]; meta: PageMeta }
```

Wraps an array as a single-page source response. Useful when the backend returns all items at once.

---

### models

#### `DetailModelBuilder<Type>`

Fluent builder for structured detail-view layouts.

| Method | Description |
|---|---|
| `.line(options)` | Add a field line from `FieldOptions` |
| `.addLine(field)` | Add a pre-built `Field` |
| `.separator()` | Insert a visual divider (renders as `undefined` line) |
| `.block()` | Start a new column block |
| `.fromObject(obj?, cols?)` | Auto-generate lines from object keys, split across `cols` blocks |
| `.build()` | Return the finished `DetailModel<Type>` |

---

#### `createDetails`

```ts
function createDetails<Type>(
  configurer?: (builder: DetailModelBuilder<Type>) => void
): DetailModel<Type>
```

```ts
interface DetailModel<Type> {
  blocks: DetaiModelBlock<Type>[];
}
interface DetaiModelBlock<Type> {
  lines: (Field<Type> | undefined)[];  // undefined = separator
}
```

```ts
import { createDetails } from '@greenstones/qui-core';

interface Customer { name: string; email: string; phone: string; city: string; }

const detail = createDetails<Customer>((b) =>
  b.line({ label: 'Name', getter: (c) => c.name })
   .line({ label: 'Email', getter: (c) => c.email })
   .separator()
   .block()
   .line({ label: 'Phone', getter: (c) => c.phone })
   .line({ label: 'City', getter: (c) => c.city })
);
```

---

#### `useDetaiModelBuilder`

```ts
function useDetaiModelBuilder<Type>(
  configurer?: (builder: DetailModelBuilder<Type>) => void
): DetailModel<Type>
```

Memoized hook wrapper for `createDetails`.

---

#### `useDetaiModelGenerator`

```ts
function useDetaiModelGenerator<Type>(v?: Type): DetailModel<Type>
```

Auto-generates a detail model by inspecting the object's keys. Good for debugging.

---

### modals

#### `ModalContextProvider`

```ts
function ModalContextProvider(props: PropsWithChildren): JSX.Element
```

Provider component that manages a stack of modal elements. Modals are rendered as direct children of this provider — place it near the root of your app.

```tsx
<ModalContextProvider>
  <App />
</ModalContextProvider>
```

---

#### `useModalContext`

```ts
function useModalContext(): {
  openModal: (modalComponent: ReactNode) => void;
  closeModal: () => void;
}
```

Hook for opening and closing modals. Supports stacking — each `openModal` pushes onto the stack; `closeModal` pops the top modal.

```tsx
import { useModalContext } from '@greenstones/qui-core';

function DeleteButton({ id }: { id: number }) {
  const { openModal, closeModal } = useModalContext();

  const handleClick = () => {
    openModal(
      <ConfirmDialog
        message="Are you sure?"
        onConfirm={() => { deleteItem(id); closeModal(); }}
        onCancel={closeModal}
      />
    );
  };

  return <button onClick={handleClick}>Delete</button>;
}
```

---

### utils

#### `exportToCsv`

```ts
function exportToCsv<Type>(
  columns: Column<Type>[],
  data: Type[],
  fileName: string
): void
```

One-shot CSV export. Converts data to CSV using column definitions and triggers a file download with a timestamp suffix.

```ts
exportToCsv(columns, users, 'users');
// Downloads: users_20241231-1430.csv
```

---

#### `convertToCsv`

```ts
function convertToCsv<Type>(columns: Column<Type>[], data: Type[]): string
```

Converts data to a CSV string without triggering a download. Uses `;` as the separator. Tries `renderToString` first, falls back to `renderString`.

---

#### `writeCsv`

```ts
function writeCsv(fileName: string, csv: string): void
```

Saves a CSV string to file using `file-saver`. Appends `_yyyyMMdd-HHmm` timestamp to the filename.

---

#### `sanitize`

```ts
function sanitize(desc: any): any
```

Cleans a CSV cell value: normalizes whitespace, escapes double-quotes, and wraps the result in quotes.

---

### entity

#### `EntityHandlers<EntityKey, Entity, EntityFields>`

```ts
interface EntityHandlers<
  EntityKey,
  Entity extends EntityKey & EntityFields,
  EntityFields extends Record<string, any>
> {
  insert(fields: EntityFields): Promise<Entity>;
  update(entityKey: EntityKey, fields: EntityFields): Promise<Entity>;
  remove(entityKey: EntityKey): Promise<void>;
  findById(entityKey: EntityKey): Promise<Entity>;
  copyFields(entityKey: EntityKey): Promise<EntityFields>;
}
```

Generic CRUD interface. Implement this to create type-safe data handlers.

```ts
interface TodoKey { id: number; }
interface TodoFields { title: string; completed: boolean; }
interface Todo extends TodoKey, TodoFields {}

const todoHandlers: EntityHandlers<TodoKey, Todo, TodoFields> = {
  insert: (fields) => api.post('/todos', fields),
  update: (key, fields) => api.put(`/todos/${key.id}`, fields),
  remove: (key) => api.delete(`/todos/${key.id}`),
  findById: (key) => api.get(`/todos/${key.id}`),
  copyFields: async (key) => {
    const todo = await api.get(`/todos/${key.id}`);
    return { title: todo.title, completed: todo.completed };
  },
};
```

---

### data

#### `DataRepository<Type, ID, CreateType, UpdateType>`

```ts
interface DataRepository<
  Type extends DataObject,
  ID extends Identifiable,
  CreateType = DefaultCreateType<Type, ID>,
  UpdateType = DefaultUpdateType<Type>
> {
  create(item: CreateType): Promise<Type>;
  findById(id: ID): Promise<Type>;
  update(id: ID, item: UpdateType): Promise<Type>;
  delete(id: ID): Promise<boolean>;
}
```

Generic async repository interface. `CreateType` defaults to the entity without its ID fields; `UpdateType` defaults to `Partial<Type>`.

**Type utilities:**

```ts
type DefaultCreateType<T, Id> = Omit<T, keyof Id> & Partial<Id>
type DefaultUpdateType<T> = Partial<T>
type Identifiable = Record<string, any>
type DataObject = Record<string, any>
```

```ts
import { DataRepository } from '@greenstones/qui-core';

interface Post { id: string; title: string; body: string; }
interface PostId { id: string; }

class PostRepository implements DataRepository<Post, PostId> {
  create(item: Omit<Post, 'id'>): Promise<Post> { /* ... */ }
  findById({ id }: PostId): Promise<Post> { /* ... */ }
  update({ id }: PostId, item: Partial<Post>): Promise<Post> { /* ... */ }
  delete({ id }: PostId): Promise<boolean> { /* ... */ }
}
```

---

## Advanced Usage

### Composing filters for `useArray`

```ts
import { useArray, Filters } from '@greenstones/qui-core';

interface Product { name: string; category: string; inStock: boolean; }
interface ProductFilter { term?: string; category?: string; inStockOnly?: boolean; }

const filter = Filters.and<Product, ProductFilter>(
  Filters.objectContains<ProductFilter>('term'),
  Filters.isEq('category', 'category'),
  Filters.isSatisfiedBy<Product, ProductFilter>(
    (p, q) => !q?.inStockOnly || p.inStock
  )
);

function ProductList({ products }: { products: Product[] }) {
  const { items, query } = useArray(products, { filter });

  return (
    <>
      <input {...query?.field('term')} placeholder="Search..." />
      <input {...query?.field('category')} placeholder="Category..." />
      <label>
        <input type="checkbox" {...query?.field('inStockOnly')} /> In stock only
      </label>
      {items?.map(/* render rows */)}
    </>
  );
}
```

---

### Stacking modals

`ModalContextProvider` maintains a stack — each `openModal` call pushes a new modal. `closeModal` pops the top one:

```tsx
function WizardButton() {
  const { openModal, closeModal } = useModalContext();

  const openStep2 = () => openModal(<Step2 onClose={closeModal} />);
  const openStep1 = () => openModal(<Step1 onNext={openStep2} onClose={closeModal} />);

  return <button onClick={openStep1}>Start Wizard</button>;
}
```

---

### Custom `ListSource` with an API backend

```ts
import { ListSource, createPageMeta } from '@greenstones/qui-core';

interface UserQuery { term?: string; }

const userSource: ListSource<User, UserQuery> = async (state) => {
  const { page = 0, pageSize = 20, sort, query } = state;
  const { users, totalCount } = await api.getUsers({
    page,
    pageSize,
    sortField: sort?.id,
    sortDir: sort?.direction,
    search: query?.term,
  });
  return {
    items: users,
    meta: createPageMeta(page, pageSize, totalCount),
  };
};
```

---

### Role-based access

```tsx
// Protect a section
<Guard role="admin">
  <button>Delete All</button>
</Guard>

// Conditionally visible nav link
<NavLink to="/reports" allowedRoles="reporter">Reports</NavLink>

// Programmatic role check
const { hasRole } = useAuth();
const canEdit = hasRole('editor');
```

---

## TypeScript

All hooks and utilities are fully generic.

### Typed `useList` with a query object

```ts
interface Invoice { id: number; amount: number; status: 'paid' | 'pending'; }
interface InvoiceQuery { status?: 'paid' | 'pending'; minAmount?: number; }

const { items, query } = useList<Invoice, InvoiceQuery>(invoiceSource, {
  initialQuery: { status: 'pending' },
});

// query.field('status') → properly typed input binding
// query.setField('status', 'paid') → type-checked
```

### Typed column definitions

```ts
// ColumnBuilder enforces that prop names match the entity type
const columns = createColumns<Invoice>((b) =>
  b.column('amount', {      // keyof Invoice — compile-time checked
    header: 'Amount',
    renderField: (amount: number) => <>${amount}</>,
  })
);
```

### Extending `DataRepository`

```ts
interface ExtendedRepo<T, ID> extends DataRepository<T, ID> {
  findAll(): Promise<T[]>;
  count(): Promise<number>;
}
```

---

## Configuration

### `useList` / `useArray` options

| Option | Type | Default | Description |
|---|---|---|---|
| `paging` | `boolean` | `true` | Enable pagination state |
| `sorting` | `boolean` | `true` | Enable sort state |
| `filtering` | `boolean` | `true` | Enable filter/query state |
| `initialPage` | `number` | `0` | Starting page (0-indexed) |
| `initialPageSize` | `number` | `20` | Starting page size |
| `initialQuery` | `Query` | `undefined` | Initial filter value |
| `initialSort` | `Sort` | `undefined` | Initial sort (`{ id: string, direction: 'asc' | 'desc' }`) |

### `DateFormatter` built-in formats

| `type` | `date-fns` pattern | Example output |
|---|---|---|
| `date` | `dd.MM.yyyy` | `31.12.2024` |
| `time` | `HH:mm` | `14:30` |
| `datetime` | `dd.MM.yyyy HH:mm` | `31.12.2024 14:30` |

Pass `formatStr` to override with any [date-fns format string](https://date-fns.org/docs/format).

---

## Error Handling

### `useAsyncMemo` / `useFetch`

Errors from rejected promises are captured in the `error` field:

```tsx
const { data, error, isError } = useAsyncMemo(() => riskyFetch(), []);

if (isError) {
  console.error(error?.message);
}
```

### `fetchJson`

- Throws `Error` with the response body text when the response is not `ok`.
- On `401` with an active token: clears `sessionStorage['auth.access_token']` and reloads the page.

```ts
try {
  const data = await fetchJson('/api/protected');
} catch (err) {
  // err.message contains the server error text
}
```

### No built-in error boundaries

This library does not provide React error boundaries. Wrap your trees with your own `ErrorBoundary` to catch render-time errors from field rendering.

---

## Contributing

### Setup

```bash
git clone <repo>
cd react-qui
bun install
```

### Development

```bash
# Build qui-core in watch mode
cd packages/qui-core
bun run watch

# Run Storybook
bun run storybook
```

### Build

```bash
# From packages/qui-core
bun run build

# From monorepo root
bun run build-all
```

### Lint

```bash
bun run lint
```

### Local publishing (Verdaccio)

```bash
# From monorepo root — requires a running Verdaccio on localhost:4873
bun run pub-local-core
```

### Pull Request guide

1. Branch from `main`.
2. Make focused, well-described commits.
3. Run `bun run lint` and `bun run build` before opening a PR.
4. There is no test suite — include Storybook stories for new components.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

---

## License

MIT
