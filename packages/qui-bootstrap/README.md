# @clickapp/qui-bootstrap

> Bootstrap 5 high-level component library — application layouts, list and details pages, tables with actions, modals.

[![npm version](https://img.shields.io/npm/v/@clickapp/qui-bootstrap)](https://www.npmjs.com/package/@clickapp/qui-bootstrap)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3-purple)](https://getbootstrap.com/)

---

## Why this library

`@clickapp/qui-bootstrap` provides a set of ready-made, composable components for common admin and data-driven UI patterns. Instead of assembling the same structures from scratch for every project, you drop in a component and focus on the data and business logic.

**Reusable building blocks**

- **App layouts** — `AppLayout`, `SidebarLayout`, `TopNavLayout`, and `BrandSidebarLayout` cover the most common shell patterns. Switch between them at runtime with `LayoutSwitcherDropdown`.
- **List pages** — `ListPage` and `QuickTable` combine a typed data table, pagination, sorting, and a filter toolbar into a single composable unit.
- **Detail views** — `DetailView`, `DetailBlock`, and `DetailItem` provide a consistent card-based layout for displaying entity fields.
- **Form fields** — `InputField`, `SelectField`, `DateField`, `CheckField`, and `PickerField` are all react-hook-form context-aware; drop them inside any `FormProvider` without manual `register` calls.
- **Modals** — `ModalForm`, `ConfirmModal`, `ErrorModal`, `MessageModal`, and `PickerModal` are self-contained dialogs managed through `ModalContextProvider`, openable imperatively via `useModals()`.
- **CRUD action hooks** — `useListActions`, `useCreateAction`, `useEditAction`, `useCopyAction`, and `useDeleteAction` wire repository calls to modal forms and confirmation dialogs, leaving only the form fields and data layer for you to supply.
- **Navigation** — `TopNavbar`, `CollapseNav`, and role-aware `NavLink` cover the most common navigation patterns out of the box.

---

## Installation

```bash
# npm
npm install @clickapp/qui-bootstrap

# yarn
yarn add @clickapp/qui-bootstrap

# pnpm
pnpm add @clickapp/qui-bootstrap
```

Install peer dependencies if not already present:

```bash
npm install @clickapp/qui-core bootstrap react-bootstrap react-hook-form \
            react-router-dom react-icons classnames react react-dom
```

Import the stylesheet once in your app entry point:

```ts
import '@clickapp/qui-bootstrap/dist/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
```

---

## Quick Start

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  BootstrapApp,
  TopNavbar,
  NavLink,
  Page,
  QuickTable,
} from '@clickapp/qui-bootstrap';
import '@clickapp/qui-bootstrap/dist/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. Define your routes
const publicRoutes = [{ path: '/login', element: <div>Login</div> }];
const protectedRoutes = [{ path: '/tasks', element: <TaskListPage /> }];

// 2. Wrap your app
export function App() {
  return (
    <BrowserRouter>
      <BootstrapApp
        projectName="My App"
        topnav={<TopNavbar><NavLink to="/tasks" text="Tasks" /></TopNavbar>}
        publicRoutes={publicRoutes}
        protectedRoutes={protectedRoutes}
      />
    </BrowserRouter>
  );
}

// 3. A typed list page
interface Task { id: string; title: string; done: boolean }

function TaskListPage() {
  const tasks: Task[] = [{ id: '1', title: 'Write README', done: true }];

  return (
    <Page header="Tasks">
      <QuickTable<Task>
        items={tasks}
        columns={[
          { header: 'Title', render: t => t.title },
          { header: 'Done',  render: t => t.done ? 'Yes' : 'No' },
        ]}
      />
    </Page>
  );
}
```

---

## API Documentation

### Table of Contents

| Module | Description |
|--------|-------------|
| [app](#app) | Application layout components and layout context |
| [auth](#auth) | Sign-in page and OAuth buttons |
| [buttons](#buttons) | Action, confirm, and modal-opening buttons |
| [forms](#forms) | react-hook-form fields (input, select, date, check, picker) |
| [modals](#modals) | Form modals, confirm/error/message/picker dialogs |
| [nav](#nav) | Collapsible nav menus and role-aware nav links |
| [navbar](#navbar) | Top navbar, auth buttons, simple navbar |
| [pages](#pages) | Page containers, list pages, loading/error pages |
| [tables](#tables) | Data tables, pagination, sorting, query controls |
| [tabs](#tabs) | Flex tab container and tab state hook |
| [details](#details) | Detail view, detail table, model-driven detail view |
| [actions](#actions) | CRUD action hooks (create, edit, copy, delete, list) |
| [labels](#labels) | i18n context provider and translation hooks |
| [entity](#entity) | Repository helper for form ↔ data transformations |

---

### `app`

#### `BootstrapApp`

High-level root component. Composes auth, layout, modals, and routing.

```ts
function BootstrapApp(props: BootstrapAppProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `projectName` | `string` | yes | Application name shown in the navbar brand |
| `topnav` | `ReactNode` | no | Content rendered inside the top navbar |
| `sidenav` | `ReactNode` | no | Content rendered inside the sidebar |
| `icon` | `ReactNode` | no | Brand icon |
| `publicRoutes` | `RouteObject[]` | no | Routes accessible without authentication |
| `protectedRoutes` | `RouteObject[]` | no | Routes that require authentication |
| `layoutProps` | `Partial<LayoutOptions>` | no | Initial layout configuration |
| `hideLayoutSwitcher` | `boolean` | no | Hide the layout switcher dropdown |

**Example**

```tsx
import { BootstrapApp } from '@clickapp/qui-bootstrap';

<BootstrapApp
  projectName="Dashboard"
  publicRoutes={[{ path: '/login', element: <LoginPage /> }]}
  protectedRoutes={[{ path: '/', element: <HomePage /> }]}
  layoutProps={{ layout: 'sidebar', width: 'fluid' }}
/>
```

---

#### `AppLayout`

Renders the correct layout (top-nav, sidebar, or brand-sidebar) based on `layout` prop.

```ts
function AppLayout(props: AppLayoutProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `layout` | `'topnav' \| 'sidebar' \| 'brand-sidebar'` | no | Layout mode (default: `'topnav'`) |
| `brand` | `ReactNode` | no | Brand element |
| `topnav` | `ReactNode` | no | Top navbar content |
| `sidenav` | `ReactNode` | no | Sidebar content |
| `width` | `'fluid' \| 'fixed'` | no | Container width |
| `children` | `ReactNode` | yes | Page content |
| `heightRelativeToParent` | `boolean` | no | Fill parent height |
| `sidebarClassName` | `string` | no | Extra class on sidebar |
| `sidebarTheme` | `string` | no | Bootstrap theme on sidebar (`'dark'`, etc.) |
| `topnavClassName` | `string` | no | Extra class on top navbar |
| `topnavTheme` | `string` | no | Bootstrap theme on top navbar |

---

#### `LayoutOptionsContext` / `useLayoutPrefs`

Share layout preferences down the tree.

```ts
const LayoutOptionsContext: React.Context<LayoutOptions>

function useLayoutPrefs(prefs?: Partial<LayoutPrefs>): LayoutPrefs
```

```tsx
import { useLayoutPrefs } from '@clickapp/qui-bootstrap';

function MyPage() {
  const { fluid, insetsClassName } = useLayoutPrefs({ fluid: true });
  return <div className={insetsClassName}>...</div>;
}
```

---

#### `BrandSidebarLayout` / `BrandSidebar` / `NavbarBrand`

Sidebar layout with a branded header area.

```ts
function BrandSidebarLayout(props: BrandSidebarLayoutProps): JSX.Element
function BrandSidebar(props: BrandSidebarProps): JSX.Element
function NavbarBrand(props: NavbarBrandProps): JSX.Element
```

| Param (`NavbarBrand`) | Type | Required | Description |
|-----------------------|------|----------|-------------|
| `name` | `string` | no | Application name |
| `icon` | `ReactNode` | no | Icon before name |
| `iconClassName` | `string` | no | Class applied to icon wrapper |
| `className` | `string` | no | Extra class |
| `children` | `ReactNode` | no | Custom brand content |

---

#### `SidebarLayout`

Flex layout with a persistent sidebar on the left.

```ts
function SidebarLayout(props: SidebarLayoutProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `top` | `ReactNode` | no | Element rendered above the split area |
| `sidebar` | `ReactNode` | no | Sidebar content |
| `children` | `ReactNode` | yes | Main content |
| `fluidContent` | `boolean` | no | Remove max-width constraint |
| `heightRelativeToParent` | `boolean` | no | Fill parent height |
| `contentInsetsClassName` | `string` | no | Class on content padding wrapper |

---

#### `TopNavLayout`

Single top-bar layout, no sidebar.

```ts
function TopNavLayout(props: TopNavLayoutProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `top` | `ReactNode` | **yes** | Navbar element |
| `children` | `ReactNode` | yes | Page content |
| `heightRelativeToParent` | `boolean` | no | Fill parent height |
| `fluid` | `boolean` | no | Fluid container |

---

#### `Sidebar`

Unstyled sidebar container.

```ts
function Sidebar(props: SidebarProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `className` | `string` | no | Extra CSS classes |
| `theme` | `string` | no | Bootstrap bg/text theme |
| `width` | `number \| string` | no | Sidebar width |
| `children` | `ReactNode` | yes | Sidebar content |
| `styles` | `CSSProperties` | no | Inline styles |
| `wrapChildreinInContainer` | `boolean` | no | Wrap children in a container div |

---

#### `LayoutSwitcherDropdown`

Dropdown to switch layout modes at runtime. Reads/writes `LayoutOptionsContext`.

```ts
function LayoutSwitcherDropdown(props: { className?: string }): JSX.Element
```

---

### `auth`

#### `SignInPage`

Full sign-in page with optional email/password form and OAuth buttons.

```ts
function SignInPage(props: SignInPageProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | no | Page heading |
| `subtitle` | `string` | no | Sub-heading below title |
| `enableSignWithPassword` | `boolean` | no | Show email/password form |
| `providers` | `OAuthProvider[]` | no | OAuth providers to render |
| `children` | `ReactNode` | no | Additional content |

```tsx
import { SignInPage } from '@clickapp/qui-bootstrap';

<SignInPage
  title="Welcome back"
  enableSignWithPassword
  providers={['google', 'github']}
/>
```

---

#### `SignInWithOAuthProviderButton`

Single OAuth sign-in button.

```ts
function SignInWithOAuthProviderButton(props: {
  provider: OAuthProvider;
  name: string;
}): JSX.Element
```

---

### `buttons`

#### `ActionButton`

Button that executes an async `onClick`, shows a spinner while running, and opens an error modal on failure.

```ts
function ActionButton(props: ActionButtonProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `onClick` | `() => Promise<void>` | yes | Async action to run |
| `label` | `string` | no | Button label |
| `children` | `ReactNode` | no | Custom button content (overrides `label`) |
| `variant` | `string` | no | Bootstrap variant (default: `'primary'`) |
| `size` | `'sm' \| 'lg'` | no | Bootstrap button size |
| `className` | `string` | no | Extra classes |
| `disabled` | `boolean` | no | Disable the button |
| `hideLabelOnRunning` | `boolean` | no | Hide label while spinner is shown |
| `errorTitle` | `string` | no | Error modal title |
| `errorBody` | `ReactNode` | no | Error modal body |

```tsx
import { ActionButton } from '@clickapp/qui-bootstrap';

<ActionButton
  label="Save"
  variant="success"
  onClick={async () => { await api.save(data); }}
  errorTitle="Save failed"
/>
```

---

#### `ConfirmButton`

Opens a confirmation modal before invoking `onClick`.

```ts
function ConfirmButton(props: ConfirmButtonProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `onClick` | `() => Promise<void>` | yes | Action after confirmation |
| `label` | `string` | yes | Button label |
| `confirmTitle` | `string` | no | Modal title |
| `confirmBody` | `string` | no | Modal body text |
| `confirmSubmitButtonLabel` | `string` | no | Confirm button label |
| `confirmCancelButtonLabel` | `string` | no | Cancel button label |
| `confirmSize` | `'sm' \| 'lg' \| 'xl'` | no | Modal size |
| `variant` | `string` | no | Bootstrap variant |
| `size` | `'sm' \| 'lg'` | no | Button size |
| `className` | `string` | no | Extra classes |
| `disabled` | `boolean` | no | Disable the button |

```tsx
<ConfirmButton
  label="Delete"
  variant="danger"
  confirmTitle="Delete item?"
  confirmBody="This action cannot be undone."
  onClick={async () => { await api.delete(id); }}
/>
```

---

#### `OpenModalButton`

Opens a fully custom modal rendered by the `modal` factory function.

```ts
function OpenModalButton(props: OpenModalButtonProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | yes | Button label |
| `modal` | `(close: () => void) => JSX.Element` | yes | Modal factory — receives `close` callback |
| `variant` | `string` | no | Bootstrap variant |
| `size` | `'sm' \| 'lg'` | no | Button size |
| `className` | `string` | no | Extra classes |
| `disabled` | `boolean` | no | Disable the button |

```tsx
import { OpenModalButton } from '@clickapp/qui-bootstrap';

<OpenModalButton
  label="Open details"
  modal={close => <MyDetailModal onClose={close} />}
/>
```

---

#### `OpenModalFormButton`

Opens a `ModalForm` pre-configured with default values and a typed submit handler.

```ts
function OpenModalFormButton<Type extends FieldValues>(
  props: OpenModalFormButtonProps<Type>
): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `modal` | `FC<ModalFormControllerProps<Type>>` | yes | Form content component |
| `defaultValues` | `DefaultValues<Type>` | no | Initial form values |
| `onSubmit` | `(data: Type) => Promise<void>` | yes | Submit handler |
| `label` | `string` | yes | Button label |
| `modalTitle` | `string` | no | Modal header title |
| `modalSubmitButtonLabel` | `string` | no | Submit button label |
| `modalCancelButtonLabel` | `string` | no | Cancel button label |
| `variant` | `string` | no | Bootstrap variant |
| `size` | `'sm' \| 'lg'` | no | Button size |
| `className` | `string` | no | Extra classes |
| `disabled` | `boolean` | no | Disable the button |
| `context` | `object` | no | Extra context passed to modal component |

```tsx
import { OpenModalFormButton } from '@clickapp/qui-bootstrap';
import { InputField } from '@clickapp/qui-bootstrap';

interface TaskForm { title: string }

<OpenModalFormButton<TaskForm>
  label="New Task"
  modalTitle="Create Task"
  defaultValues={{ title: '' }}
  onSubmit={async (data) => { await api.create(data); }}
  modal={() => <InputField<TaskForm> name="title" label="Title" />}
/>
```

---

### `forms`

All form fields must be rendered inside a `FormProvider` from `react-hook-form`.

#### `InputField`

Text input or textarea bound to react-hook-form context.

```ts
function InputField<Type extends FieldValues>(
  props: InputFieldProps<Type>
): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `Path<Type>` | **yes** | Field name in the form schema |
| `label` | `string` | no | `<label>` text |
| `type` | `string` | no | HTML input type (default: `'text'`) |
| `as` | `'input' \| 'textarea'` | no | Render as input or textarea |
| `rows` | `number` | no | Rows when `as="textarea"` |
| `placeholder` | `string` | no | Input placeholder |
| `ops` | `RegisterOptions` | no | react-hook-form validation rules |
| `className` | `string` | no | Extra CSS classes |

```tsx
import { useForm, FormProvider } from 'react-hook-form';
import { InputField } from '@clickapp/qui-bootstrap';

interface LoginForm { email: string; password: string }

function LoginForm() {
  const methods = useForm<LoginForm>();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <InputField<LoginForm>
          name="email"
          label="Email"
          type="email"
          ops={{ required: 'Email is required' }}
        />
        <InputField<LoginForm>
          name="password"
          label="Password"
          type="password"
          ops={{ required: true, minLength: 8 }}
        />
      </form>
    </FormProvider>
  );
}
```

---

#### `SelectField`

`<select>` dropdown bound to react-hook-form context.

```ts
function SelectField<Type extends FieldValues>(
  props: SelectFieldProps<Type>
): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `Path<Type>` | **yes** | Field name |
| `label` | `string` | no | Label text |
| `children` | `ReactNode` | no | `<option>` elements |
| `ops` | `RegisterOptions` | no | Validation rules |
| `multiple` | `boolean` | no | Multi-select mode |

```tsx
<SelectField<TaskForm> name="status" label="Status" ops={{ required: true }}>
  <option value="">— select —</option>
  <option value="open">Open</option>
  <option value="done">Done</option>
</SelectField>
```

---

#### `CheckField`

Checkbox bound to react-hook-form context.

```ts
function CheckField<Type extends FieldValues>(
  props: CheckFieldProps<Type>
): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `Path<Type>` | **yes** | Field name |
| `label` | `string` | no | Checkbox label |
| `ops` | `RegisterOptions` | no | Validation rules |
| `className` | `string` | no | Extra classes |

---

#### `DateField`

Date input that converts between `Date` objects and ISO strings.

```ts
function DateField<Type extends FieldValues>(
  props: DateFieldProps<Type>
): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `Path<Type>` | **yes** | Field name |
| `label` | `string` | no | Label text |
| `type` | `'date' \| 'datetime-local'` | no | Input type (default: `'date'`) |
| `placeholder` | `string` | no | Placeholder |
| `ops` | `RegisterOptions` | no | Validation rules |
| `className` | `string` | no | Extra classes |

---

#### `PickerField`

Displays a formatted value and opens a picker modal to change it.

```ts
function PickerField<Type extends FieldValues>(
  props: PickerFieldProps<Type>
): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `Path<Type>` | **yes** | Field name |
| `label` | `string` | no | Label text |
| `format` | `(value: unknown) => string` | no | Format stored value for display |
| `picker` | `(params: { close: () => void; onSelect: (v: unknown) => void }) => JSX.Element` | yes | Picker modal factory |
| `ops` | `RegisterOptions` | no | Validation rules |

```tsx
<PickerField<TaskForm>
  name="assignee"
  label="Assignee"
  format={v => (v as User).name}
  picker={({ close, onSelect }) => (
    <UserPickerModal onClose={close} onSelect={onSelect} />
  )}
/>
```

---

### `modals`

#### `ModalForm`

Standalone form modal with a `FormProvider`, submit/cancel buttons, and error handling.

```ts
function ModalForm<Type extends FieldValues>(
  props: ModalFormProps<Type>
): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `handleClose` | `() => void` | **yes** | Close callback |
| `onSubmit` | `(data: Type) => Promise<void>` | **yes** | Async submit handler |
| `defaultValues` | `DefaultValues<Type>` | no | Initial form values |
| `title` | `string` | no | Modal header text |
| `submitButtonLabel` | `string` | no | Submit button label |
| `cancelButtonLabel` | `string` | no | Cancel button label |
| `size` | `'sm' \| 'lg' \| 'xl'` | no | Modal size |
| `children` | `ReactNode` | yes | Form fields |
| `transformOnSubmit` | `(data: Type) => Type` | no | Transform values before submit |

```tsx
import { ModalForm, InputField } from '@clickapp/qui-bootstrap';

<ModalForm<TaskForm>
  handleClose={close}
  defaultValues={{ title: '' }}
  onSubmit={async data => { await api.createTask(data); close(); }}
  title="New Task"
>
  <InputField<TaskForm> name="title" label="Title" ops={{ required: true }} />
</ModalForm>
```

---

#### `useModals`

Hook providing programmatic access to modal types.

```ts
function useModals(): {
  openConfirmModal: (props: ConfirmModalProps) => void;
  confirm: (props: Omit<ConfirmModalProps, 'handleClose'>) => Promise<boolean>;
  showErrorMessage: (props: Omit<ErrorModalProps, 'handleClose'>) => Promise<void>;
  showMessage: (props: Omit<MessageModalProps, 'handleClose'>) => Promise<void>;
}
```

```tsx
import { useModals } from '@clickapp/qui-bootstrap';

function DeleteButton({ id }: { id: string }) {
  const { confirm, showErrorMessage } = useModals();

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete item?',
      message: 'This cannot be undone.',
    });
    if (!ok) return;
    try {
      await api.delete(id);
    } catch (e) {
      showErrorMessage({ title: 'Delete failed', error: e as Error });
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

---

#### `ConfirmModal`

```ts
function ConfirmModal(props: ConfirmModalProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `handleClose` | `() => void` | **yes** | Close callback |
| `title` | `string` | no | Modal title |
| `message` | `string` | no | Body text |
| `onConfirm` | `() => void` | no | Callback when confirmed |
| `onCancel` | `() => void` | no | Callback when cancelled |
| `submitButtonLabel` | `string` | no | Confirm label |
| `cancelButtonLabel` | `string` | no | Cancel label |
| `size` | `'sm' \| 'lg' \| 'xl'` | no | Modal size |

---

#### `MessageModal`

```ts
function MessageModal(props: MessageModalProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `handleClose` | `() => void` | **yes** | Close callback |
| `title` | `string` | no | Modal title |
| `children` | `ReactNode` | no | Modal body |
| `closeButtonLabel` | `string` | no | Close button label |
| `size` | `'sm' \| 'lg' \| 'xl'` | no | Modal size |

---

#### `ErrorModal`

```ts
function ErrorModal(props: ErrorModalProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `handleClose` | `() => void` | **yes** | Close callback |
| `title` | `string` | no | Modal title |
| `error` | `Error` | no | Error object to display |
| `children` | `ReactNode` | no | Additional body content |
| `closeButtonLabel` | `string` | no | Close button label |
| `size` | `'sm' \| 'lg' \| 'xl'` | no | Modal size |

---

#### `PickerModal`

Table-based selection modal.

```ts
function PickerModal<Type, Query>(props: PickerModalProps<Type, Query>): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `handleClose` | `() => void` | **yes** | Close callback |
| `onSelect` | `(item: Type) => void` | **yes** | Called when a row is selected |
| `listData` | `ListData<Type, Query>` | **yes** | Data source from qui-core |
| `columns` | `Column<Type>[]` | **yes** | Column definitions |
| `title` | `string` | no | Modal title |
| `size` | `'sm' \| 'lg' \| 'xl'` | no | Modal size |

---

### `nav`

#### `CollapseNav`

Collapsible sidebar navigation section.

```ts
function CollapseNav(props: CollapseNavProps): JSX.Element
// Sub-component:
CollapseNav.Item(props: { to: string; children: ReactNode }): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | yes | Section heading |
| `id` | `string` | yes | Unique collapse ID |
| `children` | `ReactNode` | yes | `CollapseNav.Item` elements |
| `expanded` | `boolean` | no | Initially expanded |
| `className` | `string` | no | Extra classes |

```tsx
import CollapseNav from '@clickapp/qui-bootstrap';

<CollapseNav label="Admin" id="admin-nav" expanded>
  <CollapseNav.Item to="/admin/users">Users</CollapseNav.Item>
  <CollapseNav.Item to="/admin/settings">Settings</CollapseNav.Item>
</CollapseNav>
```

---

#### `NavLink`

react-router-dom `NavLink` extended with role-based access control.

```ts
function NavLink(props: NavLinkProps): JSX.Element | null
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | `string` | **yes** | Route path |
| `text` | `string` | no | Link text |
| `icon` | `ReactNode` | no | Icon before text |
| `allowedRoles` | `string[]` | no | Hides link if user lacks roles |
| `end` | `boolean` | no | Exact match for active state |
| `className` | `string` | no | Extra classes |
| `children` | `ReactNode` | no | Custom content |

---

### `navbar`

#### `TopNavbar`

Responsive Bootstrap navbar.

```ts
function TopNavbar(props: TopNavbarProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `children` | `ReactNode` | no | Nav items |
| `brand` | `ReactNode` | no | Brand element (left side) |
| `theme` | `string` | no | Bootstrap navbar theme (`'dark'`, etc.) |
| `fluid` | `boolean` | no | Fluid container |
| `className` | `string` | no | Extra classes on navbar |
| `containerClassName` | `string` | no | Extra classes on inner container |

---

#### `NavbarAuthButtons`

Renders a "Sign In" button when logged out and a "Logout" button when logged in.

```ts
function NavbarAuthButtons(props: {
  variant?: string;
  className?: string;
}): JSX.Element
```

---

#### `SimpleNavbar`

Minimal navbar that includes `NavbarAuthButtons` automatically.

```ts
function SimpleNavbar(props: {
  name?: string;
  children?: ReactNode;
}): JSX.Element
```

---

### `pages`

#### `Page`

Full page layout with optional breadcrumb, header, subheader, and footer sections. Shows `LoadingPage` or `GenericErrorPage` based on async state.

```ts
function Page(props: PageProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `header` | `ReactNode` | no | Page title / header bar content |
| `subheader` | `ReactNode` | no | Secondary header |
| `breadcrumb` | `ReactNode` | no | Breadcrumb bar |
| `footer` | `ReactNode` | no | Footer content |
| `children` | `ReactNode` | no | Main body content |
| `loading` | `boolean` | no | Show loading spinner |
| `error` | `Error \| null` | no | Show error page |
| `scrollBody` | `boolean` | no | Enable body scroll |
| `fillBody` | `boolean` | no | Stretch body to fill height |
| `fluid` | `boolean` | no | Fluid container |
| `className` | `string` | no | Extra classes |
| `insets` | `string` | no | Custom inset class |
| `noInsets` | `boolean` | no | Remove default padding |

```tsx
import { Page } from '@clickapp/qui-bootstrap';

<Page header="Dashboard" loading={isLoading} error={error}>
  <p>Content here</p>
</Page>
```

---

#### `PageHeader`

```ts
function PageHeader(props: { children: ReactNode; addon?: ReactNode }): JSX.Element
```

---

#### `BasePage`

Minimal page container that applies layout preferences.

```ts
function BasePage(props: {
  fluid?: boolean;
  className?: string;
  insets?: string;
  noInsets?: boolean;
  children: ReactNode;
}): JSX.Element
```

---

#### `ListPage`

Page with a `QuickTable`, optional toolbar, filter field, and create button.

```ts
function ListPage<Type, Query>(props: ListPageProps<Type, Query>): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `header` | `ReactNode` | no | Page title |
| `list` | `ListData<Type, Query>` | **yes** | Data source from qui-core |
| `columns` | `Column<Type>[]` | **yes** | Column definitions |
| `toolbar` | `ReactNode` | no | Custom toolbar content |
| `toolbarContent` | `ReactNode` | no | Additional toolbar content |
| `actions` | `object` | no | Action handlers |
| `filterField` | `keyof Query` | no | Query field to bind filter input |
| `createButtonProps` | `object` | no | Props for the create button |
| `tableProps` | `Partial<QuickTableDisplayProps<Type>>` | no | Extra table props |

---

#### `LoadingPage` / `ErrorPage` / `GenericErrorPage` / `MessagePage`

```ts
function LoadingPage(props: { title?: string }): JSX.Element
function ErrorPage(props: { title?: string; children?: ReactNode }): JSX.Element
function GenericErrorPage(props: { error: Error }): JSX.Element
function MessagePage(props: { children?: ReactNode }): JSX.Element
```

---

### `tables`

#### `QuickTable`

Typed data table with optional sorting, hover, striping, and row selection.

```ts
function QuickTable<Type>(props: QuickTableProps<Type>): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | `Type[]` | **yes** | Row data |
| `columns` | `Column<Type>[]` | **yes** | Column definitions |
| `sorting` | `Sorting` | no | Sorting state and setter from qui-core |
| `selection` | `Selection<Type>` | no | Row selection state |
| `className` | `string` | no | Extra classes on `<table>` |
| `stripped` | `boolean` | no | Striped rows |
| `hover` | `boolean` | no | Hover highlight rows |
| `size` | `'sm'` | no | Compact table |
| `rowClassName` | `(item: Type) => string` | no | Per-row class function |

```tsx
import { QuickTable } from '@clickapp/qui-bootstrap';

interface User { id: string; name: string; email: string }

<QuickTable<User>
  items={users}
  hover
  stripped
  columns={[
    { header: 'Name',  render: u => u.name },
    { header: 'Email', render: u => u.email },
  ]}
/>
```

---

#### `Paging`

Bootstrap pagination controls.

```ts
function Paging(props: {
  paging: Paging;           // from qui-core
  hidden?: boolean;
  hideOnSinglePage?: boolean;
}): JSX.Element
```

---

#### `SortingColumnHeader`

Clickable column header that updates a sorting state.

```ts
function SortingColumnHeader(props: {
  header: string;
  sorting: Sorting;
  sortId: string;
}): JSX.Element
```

---

#### Query Controls

Filter controls bound to a typed query object.

```ts
function QueryInput<Query>(props: QueryInputProps<Query>): JSX.Element
function QueryCheckbox<Query>(props: QueryCheckboxProps<Query>): JSX.Element
function QueryDropdown<Query>(props: QueryDropdownProps<Query>): JSX.Element
```

```tsx
interface TaskQuery { search: string; showDone: boolean }

<QueryInput<TaskQuery>   query={q} field="search"   placeholder="Search…" />
<QueryCheckbox<TaskQuery> query={q} field="showDone" label="Show completed" />
```

---

### `tabs`

#### `Tabs`

Flex-layout tab container. Children are React Bootstrap `Tab` components.

```ts
function Tabs(props: TabsProps): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `defaultActiveKey` | `string` | no | Initially active tab key |
| `className` | `string` | no | Extra classes |
| `tabClassName` | `string` | no | Extra classes on each tab |
| `onChange` | `(key: string) => void` | no | Called on tab change |
| `children` | `ReactNode` | yes | `Tab` elements |

---

#### `useTabs`

Hook for controlled tab state.

```ts
function useTabs(
  initialValue: string,
  onChange?: (key: string) => void
): [string, (key: string) => void]
```

---

### `details`

#### `DetailView` / `DetailBlock` / `DetailItem`

Composable card-based detail layout.

```ts
function DetailView(props: { className?: string; children: ReactNode }): JSX.Element
function DetailBlock(props: { className?: string; children: ReactNode }): JSX.Element
function DetailItem(props: { label: string; width?: number; children: ReactNode }): JSX.Element
function DetailItemSeparator(): JSX.Element
function DetailBlockSeparator(): JSX.Element
```

```tsx
import { DetailView, DetailBlock, DetailItem } from '@clickapp/qui-bootstrap';

<DetailView>
  <DetailBlock>
    <DetailItem label="Name">{user.name}</DetailItem>
    <DetailItem label="Email">{user.email}</DetailItem>
  </DetailBlock>
</DetailView>
```

---

#### `DetailTable`

Renders an object's properties as a two-column table.

```ts
function DetailTable(props: {
  data: Record<string, unknown>;
  className?: string;
  excludes?: string[];
  hideEmptyProps?: boolean;
}): JSX.Element
```

---

#### `DetailModelView`

Renders a `DetailModel` descriptor from `@clickapp/qui-core`.

```ts
function DetailModelView<Type>(props: {
  model: DetailModel<Type>;
  value: Type;
  className?: string;
}): JSX.Element
```

---

### `actions`

Action hooks wire together repository calls, modal forms, confirmation dialogs, and success callbacks. They depend on `ModalContextProvider` being present in the tree.

#### `useListActions`

Full CRUD action set for a list page.

```ts
function useListActions<RepositoryType, Identifiable>(
  props: UseListActionsProps<RepositoryType, Identifiable>
): {
  create: () => Promise<void>;
  edit:   (entity: Identifiable) => Promise<void>;
  copy:   (entity: Identifiable) => Promise<void>;
  remove: (entity: Identifiable) => Promise<void>;
  reloadList: () => void;
}
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `repository` | `Repository<RepositoryType, Identifiable>` | **yes** | Data access object |
| `modal` | `FC<ModalFormControllerProps<FormFields>>` | **yes** | Form component |
| `onSuccess` | `() => void` | no | Called after any successful mutation |
| `createTitle` | `string` | no | Create modal title |
| `editTitle` | `string` | no | Edit modal title |
| `copyTitle` | `string` | no | Copy modal title |
| `deleteTitle` | `string` | no | Delete confirmation title |
| `modalFormSize` | `'sm' \| 'lg' \| 'xl'` | no | Form modal size |
| `deleteModalSize` | `'sm' \| 'lg' \| 'xl'` | no | Delete modal size |
| `unsetKeysOnCopy` | `(keyof RepositoryType)[]` | no | Keys to clear when copying |
| `navigationProps` | `NavigationProps<Identifiable>` | no | Post-action navigation config |

```tsx
import { useListActions, ListItemButtons } from '@clickapp/qui-bootstrap';

function TaskListPage() {
  const { data, reload } = useListData<Task, TaskQuery>(taskRepo, defaultQuery);
  const actions = useListActions<Task, Task>({
    repository: taskRepo,
    modal: TaskFormFields,
    onSuccess: reload,
    createTitle: 'New Task',
    editTitle: 'Edit Task',
    deleteTitle: 'Delete Task?',
  });

  return (
    <Page header="Tasks">
      <button onClick={actions.create}>Add Task</button>
      <QuickTable<Task>
        items={data?.items ?? []}
        columns={[
          { header: 'Title', render: t => t.title },
          {
            header: '',
            render: t => <ListItemButtons entity={t} actions={actions} />,
          },
        ]}
      />
    </Page>
  );
}
```

---

#### `useListItemActions`

Item-level actions (edit, copy, delete) without a create action.

```ts
function useListItemActions<RepositoryType, Identifiable>(
  props: UseListItemActionsProps<RepositoryType, Identifiable>
): {
  edit:   (entity: Identifiable) => Promise<void>;
  copy:   (entity: Identifiable) => Promise<void>;
  remove: (entity: Identifiable) => Promise<void>;
}
```

---

#### `useCreateAction`

```ts
function useCreateAction<Type, Identifiable>(
  props: UseCreateActionProps<Type, Identifiable>
): () => Promise<void>
```

---

#### `useEditAction`

```ts
function useEditAction<Type, Identifiable>(
  props: UseEditActionProps<Type, Identifiable>
): (entity: Identifiable) => Promise<void>
```

---

#### `useDeleteAction`

```ts
function useDeleteAction<Identifiable, RepositoryType>(
  props: UseDeleteActionProps<Identifiable, RepositoryType>
): (entity: Identifiable) => Promise<void>
```

---

#### `useCopyAction`

```ts
function useCopyAction<Type, Identifiable>(
  props: UseCopyActionProps<Type, Identifiable>
): (entity: Identifiable) => Promise<void>
```

---

#### `ListItemButtons`

Renders Edit / Copy / Delete buttons for a table row.

```ts
function ListItemButtons<T>(props: ListItemButtonsProps<T>): JSX.Element
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `entity` | `T` | **yes** | The row entity |
| `actions` | `ListItemActions<T>` | **yes** | Action handlers |
| `size` | `'sm' \| 'lg'` | no | Button size |
| `variant` | `string` | no | Bootstrap variant |
| `className` | `string` | no | Extra classes |
| `labelEdit` | `string` | no | Edit button label |
| `labelDelete` | `string` | no | Delete button label |
| `labelCopy` | `string` | no | Copy button label |
| `hideCopy` | `boolean` | no | Hide copy button |
| `disabled` | `boolean` | no | Disable all buttons |
| `before` | `ReactNode` | no | Content before buttons |
| `after` | `ReactNode` | no | Content after buttons |

---

#### `ListActionsColumns`

Utility that appends an actions column to a column array.

```ts
const ListActionsColumns: {
  append<T>(
    columns: Column<T>[],
    actions: ListItemActions<T>,
    options?: Partial<ListItemButtonsProps<T>>
  ): Column<T>[]
}
```

---

#### Action Type Utilities

```ts
type ListItemAction<T> = (entity: T) => Promise<void>

interface ModalFormControllerProps<FormFields extends FieldValues> {
  context?: Record<string, unknown>;
}

interface NavigationProps<Type> {
  navigate: (path: string) => void;
  getPath: (entity: Type) => string;
}
```

---

### `labels`

#### `I18nContextProvider`

Provides translated strings via `useI18n`. Wrap at the app root (already done by `BootstrapApp`).

```ts
function I18nContextProvider(props: { children: ReactNode }): JSX.Element
```

#### `useI18n`

```ts
function useI18n(): (key: string, values?: Record<string, string>) => string
```

```tsx
import { useI18n } from '@clickapp/qui-bootstrap';

function SubmitButton() {
  const t = useI18n();
  return <button type="submit">{t('button.submit')}</button>;
}
```

Supported keys:

| Key | English | German |
|-----|---------|--------|
| `button.submit` | Submit | Ausführen |
| `button.cancel` | Cancel | Abbrechen |

Supported locales: `"en"` \| `"de"`

---

#### `LabelContextProvider` / `useLabels`

Scoped translation context.

```ts
function LabelContextProvider(props: {
  children: ReactNode;
  contextKey: string;
}): JSX.Element

function useLabels(): (key: string) => string
```

---

### `entity`

#### `RepositoryHelper`

Adapter class that maps between your form schema and repository create/update types.

```ts
class RepositoryHelper<
  IdentifiableType,
  FormData,
  DataObjectType,
  CreateType,
  UpdateType
> {
  constructor(
    repository: Repository<DataObjectType, IdentifiableType>,
    updateTransform: (formData: FormData) => UpdateType,
    createTransform: (formData: FormData) => CreateType,
    formTransform: (data: DataObjectType) => FormData
  )

  update(id: string, formData: FormData): Promise<void>
  create(formData: FormData): Promise<void>
  findById(id: string): Promise<FormData>
}
```

```tsx
import { RepositoryHelper } from '@clickapp/qui-bootstrap';

interface TaskForm { title: string; dueDate: string }
interface Task     { id: string; title: string; due_date: Date }

const helper = new RepositoryHelper<Task, TaskForm, Task, Omit<Task,'id'>, Partial<Task>>(
  taskRepo,
  form => ({ title: form.title, due_date: new Date(form.dueDate) }),
  form => ({ title: form.title, due_date: new Date(form.dueDate) }),
  task => ({ title: task.title, dueDate: task.due_date.toISOString() }),
);
```

---

## Advanced Usage

### Full CRUD list page

```tsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Page, ListPage, QuickTable, Paging,
  useListActions, ListItemButtons,
  InputField, SelectField,
  ModalFormControllerProps,
} from '@clickapp/qui-bootstrap';
import { useListData } from '@clickapp/qui-core';

interface Project { id: string; name: string; status: 'active' | 'archived' }
interface ProjectQuery { search: string }

// 1. Form fields component
function ProjectFormFields(_: ModalFormControllerProps<Omit<Project, 'id'>>) {
  return (
    <>
      <InputField<Omit<Project, 'id'>>
        name="name"
        label="Name"
        ops={{ required: 'Name is required' }}
      />
      <SelectField<Omit<Project, 'id'>> name="status" label="Status">
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </SelectField>
    </>
  );
}

// 2. List page
export function ProjectListPage() {
  const listData = useListData<Project, ProjectQuery>(projectRepo, { search: '' });
  const actions = useListActions<Project, Project>({
    repository: projectRepo,
    modal: ProjectFormFields,
    onSuccess: listData.reload,
    createTitle: 'New Project',
    editTitle: 'Edit Project',
    deleteTitle: 'Delete Project?',
  });

  return (
    <Page header="Projects">
      <div className="mb-2">
        <button className="btn btn-primary" onClick={actions.create}>
          + New Project
        </button>
      </div>
      <QuickTable<Project>
        items={listData.data?.items ?? []}
        hover
        stripped
        columns={[
          { header: 'Name',   render: p => p.name },
          { header: 'Status', render: p => p.status },
          {
            header: '',
            render: p => (
              <ListItemButtons<Project>
                entity={p}
                actions={actions}
                size="sm"
                hideCopy
              />
            ),
          },
        ]}
      />
      <Paging paging={listData.paging} hideOnSinglePage />
    </Page>
  );
}
```

---

### Runtime layout switching

```tsx
import { AppLayout, LayoutSwitcherDropdown, TopNavbar } from '@clickapp/qui-bootstrap';

<AppLayout
  layout="sidebar"
  width="fluid"
  topnav={
    <TopNavbar>
      <LayoutSwitcherDropdown className="ms-auto" />
    </TopNavbar>
  }
  sidenav={<MySideNav />}
>
  <Outlet />
</AppLayout>
```

---

### Promise-based confirmation

```tsx
const { confirm } = useModals();

async function handleArchive(id: string) {
  const confirmed = await confirm({
    title: 'Archive project?',
    message: 'Archived projects are hidden from the main list.',
    submitButtonLabel: 'Archive',
  });
  if (confirmed) {
    await projectRepo.archive(id);
  }
}
```

---

### Custom picker field

```tsx
interface Category { id: string; name: string }

<PickerField<ProjectForm>
  name="categoryId"
  label="Category"
  format={(id) => categories.find(c => c.id === id)?.name ?? '—'}
  picker={({ close, onSelect }) => (
    <PickerModal<Category, CategoryQuery>
      handleClose={close}
      onSelect={cat => { onSelect(cat.id); close(); }}
      listData={categoryListData}
      columns={[{ header: 'Name', render: c => c.name }]}
      title="Select Category"
    />
  )}
/>
```

---

## TypeScript

### Generic form fields

All form fields accept a generic `Type extends FieldValues` that enforces `name` is a valid key of your form schema:

```ts
// Compile error: 'nonexistent' is not a key of ProjectForm
<InputField<ProjectForm> name="nonexistent" label="Bad" />

// OK
<InputField<ProjectForm> name="name" label="Name" />
```

### Generic action hooks

CRUD hooks keep entity types consistent across the form and repository:

```ts
const actions = useListActions<
  ProjectEntity,   // RepositoryType — shape returned by the repository
  ProjectEntity    // Identifiable   — shape passed to edit/delete
>({ repository, modal });

// actions.edit expects (entity: ProjectEntity) => Promise<void>
```

### `ModalFormControllerProps`

Use this as the props type for any component passed as the `modal` prop:

```ts
import type { ModalFormControllerProps } from '@clickapp/qui-bootstrap';
import type { FieldValues } from 'react-hook-form';

interface ProjectForm extends FieldValues {
  name: string;
  status: string;
}

function ProjectModal(_props: ModalFormControllerProps<ProjectForm>) {
  return (
    <>
      <InputField<ProjectForm> name="name" label="Name" />
      <SelectField<ProjectForm> name="status" label="Status">
        <option value="active">Active</option>
      </SelectField>
    </>
  );
}
```

### `ListItemAction`

```ts
import type { ListItemAction } from '@clickapp/qui-bootstrap';

const customDelete: ListItemAction<Project> = async (project) => {
  await api.delete(project.id);
};
```

---

## Configuration

### `AppLayout` — `LayoutOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `layout` | `'topnav' \| 'sidebar' \| 'brand-sidebar'` | `'topnav'` | Active layout mode |
| `width` | `'fluid' \| 'fixed'` | `'fixed'` | Container width |
| `sidebarClassName` | `string` | `undefined` | Extra class on sidebar |
| `sidebarTheme` | `string` | `undefined` | Bootstrap theme on sidebar |
| `topnavClassName` | `string` | `undefined` | Extra class on navbar |
| `topnavTheme` | `string` | `undefined` | Bootstrap theme on navbar |

### `Page` — Layout preferences

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fluid` | `boolean` | `false` | Remove max-width |
| `noInsets` | `boolean` | `false` | Remove padding |
| `scrollBody` | `boolean` | `false` | Scroll within page body |
| `fillBody` | `boolean` | `false` | Stretch body to viewport |

### `QuickTable` — Display options (`QuickTableDisplayProps`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `stripped` | `boolean` | `false` | Striped rows |
| `hover` | `boolean` | `false` | Hover highlight |
| `size` | `'sm'` | `undefined` | Compact size |
| `className` | `string` | `undefined` | Extra classes |

---

## Error Handling

### `ActionButton`

When the `onClick` Promise rejects, `ActionButton` automatically opens an `ErrorModal`. Customize it:

```tsx
<ActionButton
  errorTitle="Could not save"
  errorBody={<p>Please check your connection and try again.</p>}
  onClick={riskyOperation}
>
  Save
</ActionButton>
```

### `useModals().showErrorMessage`

Use for programmatic error display outside of button click handlers:

```tsx
const { showErrorMessage } = useModals();

try {
  await api.load();
} catch (e) {
  await showErrorMessage({ title: 'Load failed', error: e as Error });
}
```

### `ModalForm`

`ModalForm` catches errors thrown by `onSubmit` and re-throws them after closing, allowing parent error boundaries to handle them. Wrap mutation logic in try/catch within `onSubmit` if you want modal-local error display.

### Error boundary

Use `GlobalErrorPage` as the fallback in React error boundaries:

```tsx
import { GlobalErrorPage } from '@clickapp/qui-bootstrap';

<ErrorBoundary fallbackRender={({ error }) => <GlobalErrorPage error={error} />}>
  <App />
</ErrorBoundary>
```

---

## Contributing

### Setup

```bash
# Clone the monorepo
git clone <repo-url>
cd clickapp-monorepo/clickapp

# Install all dependencies
npm install

# Build qui-core first (qui-bootstrap depends on it)
cd packages/qui-core && npm run build && cd ../..

# Start qui-bootstrap dev server / Storybook
cd packages/qui-bootstrap
npm run storybook      # Component development on http://localhost:6006
npm run build          # Production build to dist/
npm run watch          # Watch mode
npm run lint           # ESLint
```

### Local end-to-end testing

```bash
# Publish all packages to a local Verdaccio registry (localhost:4873)
npm run pub-local       # from monorepo root

# Or publish only qui-bootstrap
npm run pub-local-bs
```

### PR guide

1. Fork and create a feature branch: `git checkout -b feat/my-feature`
2. Add or update component stories in `src/` alongside the source file
3. Run `npm run lint` — all lint rules must pass
4. Run `npm run build` — the build must succeed with no TypeScript errors
5. Open a pull request against `main`

> There is no automated test suite. Component behaviour is verified via Storybook stories.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full release history.

---

## License

MIT © ClickApp
