import { type Column, type DataRepository } from "@clickapp/qui-core";
import { type ModalFormControllerProps, type NavigationProps } from "./utils";
import { useCreateAction } from "./useCreateAction";
import { useNavigate } from "react-router-dom";
import { useListItemActions } from "./useListItemActions";
import type { ReactNode } from "react";
import { type ModalFormProps } from "../modals";
import { ButtonGroup } from "react-bootstrap";
import { ActionButton } from "../buttons";

export function useListActions<
  RepositoryType extends Record<string, any>,
  Identifiable extends Record<string, any> = RepositoryType,
>({
  modal,

  createTitle = "Create Item",
  createButtonLabel = "Create",

  createFormValues,

  repository,

  onSuccess,

  navigationProps,

  modalFormSize = "lg",
  deleteModalSize = "lg",

  editTitle = "Edit Item",
  editButtonLabel = "Save",
  copyTitle = "Copy Item",
  copyButtonLabel = "Copy",
  cancelButtonLabel = "Cancel",
  deleteTitle = "Confirm Deletion",
  deleteMessage = () => <>Are you sure you want to delete this item?</>,
  deleteButtonLabel = "Delete",
  unsetKeysOnCopy = ["id"],
}: {
  repository: DataRepository<
    RepositoryType,
    Identifiable,
    Partial<RepositoryType>,
    Partial<RepositoryType>
  >;

  modal: (props: ModalFormProps<Partial<RepositoryType>>) => JSX.Element;
  createTitle?: string;
  createButtonLabel?: string;
  cancelButtonLabel?: string;
  modalFormSize?: "sm" | "lg" | "xl";
  createFormValues?: () => Partial<RepositoryType>;

  editTitle?: string;
  editButtonLabel?: string;
  copyTitle?: string;
  copyButtonLabel?: string;
  deleteTitle?: string;
  deleteMessage?: (v: Identifiable) => ReactNode;
  deleteButtonLabel?: string;

  deleteModalSize?: "sm" | "lg" | "xl";
  unsetKeysOnCopy?: (keyof RepositoryType)[];

  onSuccess?: (
    type: "edit" | "delete" | "copy" | "create" | "reload",
    value: unknown,
  ) => void;

  navigationProps?: NavigationProps<RepositoryType>;
}) {
  const listActions = useBaseListActions({
    repository,
    modal,
    createTitle,
    createButtonLabel,
    cancelButtonLabel,
    modalFormSize,
    createFormValues,
    navigationProps,
    onSuccess,
  });

  const itemActions = useListItemActions({
    repository,
    onSuccess,
    navigationProps,
    modal,

    modalFormSize,
    deleteModalSize,

    editTitle,
    editButtonLabel,
    copyTitle,
    copyButtonLabel,
    cancelButtonLabel,
    deleteTitle,
    deleteMessage,
    deleteButtonLabel,
    unsetKeysOnCopy,
  });

  return { ...listActions, ...itemActions };
}

export function useBaseListActions<
  RepositoryType extends Record<string, any>,
  Identifiable extends Record<string, any>,
>({
  repository,
  modal,
  modalFormSize = "lg",
  createTitle = "Create Item",
  createButtonLabel = "Create",
  cancelButtonLabel = "Cancel",
  createFormValues,
  navigationProps,
  onSuccess,
}: {
  repository: DataRepository<
    RepositoryType,
    Identifiable,
    Partial<RepositoryType>,
    Partial<RepositoryType>
  >;
  reload?: () => void;
  onSuccess?: (type: "create" | "reload", value: unknown) => void;
  modal: (props: ModalFormProps<Partial<RepositoryType>>) => JSX.Element;
  createTitle?: string;
  createButtonLabel?: string;
  cancelButtonLabel?: string;
  modalFormSize?: "sm" | "lg" | "xl";
  createFormValues?: () => Partial<RepositoryType>;
  navigationProps?: NavigationProps<RepositoryType>;
}): BaseListActions {
  const navigate = useNavigate();

  const onCreate = (v: RepositoryType) => {
    onSuccess?.("create", v);

    if (navigationProps) {
      if (navigationProps.navigateAfterCreate) {
        navigate(navigationProps.path(v));
      }
    }
  };

  const create = useCreateAction({
    repository,
    modal: (props: ModalFormControllerProps<Partial<RepositoryType>>) =>
      modal({
        ...props,
        onSubmit: props.handleSubmit,
        defaultValues: async () => props.defaultValues,
        title: createTitle,
        submitButtonLabel: createButtonLabel,
        cancelButtonLabel,
        size: modalFormSize,
      }),
    onSuccess: onCreate,
    defaultFormValues: createFormValues,
  });

  const reloadList = () => onSuccess?.("reload", undefined);

  return { create, reloadList };
}

export interface BaseListActions {
  create?: () => void;
  reloadList?: () => void;
}

export interface ListItemActions<T extends Record<string, any>> {
  edit?: (entity: T) => Promise<void>;
  remove?: (entity: T) => Promise<void>;
  copy?: (entity: T) => Promise<void>;
}

export function ListItemButtons<T extends Record<string, any>>({
  entity,
  actions,
  size = "sm",
  variant = "outline-primary",
  className,
  labelEdit = "Edit",
  labelDelete = "Delete",
  labelCopy = "Copy",
  hideCopy = false,
  disabled,
  before,
  after,
}: {
  entity: T;
  actions: ListItemActions<T>;
  size?: "sm" | "lg";
  variant?: string;
  className?: string;
  labelEdit?: string;
  labelDelete?: string;
  labelCopy?: string;
  hideCopy?: boolean;
  disabled?: boolean;

  before?: (v: T) => ReactNode;
  after?: (v: T) => ReactNode;
}) {
  return (
    <ButtonGroup className={className}>
      {before?.(entity)}
      {actions.edit && (
        <ActionButton
          size={size}
          variant={variant}
          disabled={disabled}
          onClick={async (e) => actions?.edit?.(entity)}
        >
          {labelEdit}
        </ActionButton>
      )}
      {actions.copy && !hideCopy && (
        <ActionButton
          size={size}
          variant={variant}
          disabled={disabled}
          onClick={async (e) => actions.copy && actions?.copy(entity)}
        >
          {labelCopy}
        </ActionButton>
      )}
      {actions.remove && (
        <ActionButton
          variant={variant}
          size={size}
          disabled={disabled}
          onClick={async (e) => actions.remove && actions?.remove(entity)}
        >
          {labelDelete}
        </ActionButton>
      )}
      {after?.(entity)}
    </ButtonGroup>
  );
}

function column<T extends Record<string, any>>(fn: (v: T) => ReactNode) {
  return {
    render: (v) => fn(v),
    header: " ",
    width: "6em",
    className: "text-end",
    renderString: () => "",
  } as Column<T>;
}

export const ListActionsColumns = {
  column,
  editDeleteButtons<T extends Record<string, any>>(
    actions: ListItemActions<T>,
    ops: {
      before?: (v: T) => ReactNode;
      after?: (v: T) => ReactNode;
    } = {},
  ) {
    return column<T>((v) => (
      <ListItemButtons
        entity={v}
        actions={actions}
        size="sm"
        variant="light"
        hideCopy={true}
        {...ops}
      />
    ));
  },

  editDeleteCopyButtons<
    T extends Identifiable,
    Identifiable extends Record<string, any>,
  >(
    actions: ListItemActions<T>,
    ops: {
      before?: (v: T) => ReactNode;
      after?: (v: T) => ReactNode;
    } = {},
  ) {
    return column<T>((v) => (
      <ListItemButtons
        entity={v}
        actions={actions}
        size="sm"
        variant="light"
        {...ops}
      />
    ));
  },
};
