import { Column, DataRepository, useModalContext } from "@clickapp/qui-core";
import { FC, ReactNode } from "react";
import { ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "../buttons/ActionButton";
import { ModalFormProps } from "../modals/ModalForm";
import { useModals } from "../modals/Modals";

export interface ListActions<
  T extends Identifiable,
  Identifiable extends Record<string, any>
> extends ListItemActions<T, Identifiable>,
    BaseListActions {}

export interface BaseListActions {
  create?: (values?: any) => Promise<void>;
  reloadList?: () => Promise<void>;
}

export interface ListItemActions<
  T extends Identifiable,
  Identifiable extends Record<string, any>
> {
  edit?: (entity: T) => Promise<void>;
  remove?: (entity: T) => Promise<void>;
  copy?: (entity: T) => Promise<void>;
}

export function useListActions<
  TRef extends Identifiable, // object in list with id
  Identifiable extends Record<string, any>, // object with id
  EditType extends Record<string, any> = Omit<TRef, keyof Identifiable> &
    Partial<Identifiable>, // object for editing
  SelectType extends Identifiable = TRef, //  object loaded from backend
  CreateType = Omit<SelectType, keyof Identifiable> & Partial<Identifiable>, // object for creating in backend
  UpdateType = Partial<Omit<SelectType, keyof Identifiable>> // object for updating in backend
>({
  reload,
  modal: Modal,
  createModalTitle = "Create",
  editModalTitle = "Edit",
  deleteModalTitle = "Delete",
  createButtonLabel = "Save",
  editButtonLabel = "Save",
  deleteButtonLabel = "Delete",
  cancelButtonLabel = "Cancel",
  deleteConfirmMessage = (e) => "Are you sure?",
  linkToEntity,
  linkToList,
  modalSize,
  repository,
  defaultValuesOnCreate,
  transformForEditing = clone<SelectType, EditType>,
  transformForCloning = cloneWithoutId<SelectType, EditType>,
  transformOnCreate = clone<EditType, CreateType>,
  transformOnUpdate = clone<EditType, UpdateType>,
}: {
  reload?: () => void;
  modal: FC<ModalFormProps<EditType>>;
  createModalTitle?: string;
  editModalTitle?: string;
  deleteModalTitle?: string;
  createButtonLabel?: string;
  editButtonLabel?: string;
  deleteButtonLabel?: string;
  cancelButtonLabel?: string;
  deleteConfirmMessage?: (entity: TRef) => ReactNode;
  linkToEntity?: (entity: Identifiable) => string;
  linkToList?: string;
  modalSize?: "sm" | "lg" | "xl";
  repository: DataRepository<SelectType, Identifiable, CreateType, UpdateType>;
  defaultValuesOnCreate?: () => any;
  transformForEditing?: (v: SelectType) => EditType;
  transformForCloning?: (v: SelectType) => EditType;
  transformOnCreate?: (formData: EditType) => CreateType;
  transformOnUpdate?: (formData: EditType, origValue: SelectType) => UpdateType;
}): ListActions<TRef, Identifiable> {
  const create = useCreateAction<
    SelectType,
    Identifiable,
    EditType,
    CreateType
  >({
    reload,
    modal: Modal,
    modalTitle: createModalTitle,
    createButtonLabel,
    cancelButtonLabel,
    linkToEntity,
    modalSize,
    create: async (v) => await repository.create(v),
    transformOnCreate,
    defaultValues: defaultValuesOnCreate,
  });

  const actions = useListItemActions<
    TRef,
    Identifiable,
    EditType,
    SelectType,
    CreateType,
    UpdateType
  >({
    reload,
    modal: Modal,
    editModalTitle,
    deleteModalTitle,
    editButtonLabel,
    deleteButtonLabel,
    cancelButtonLabel,
    deleteConfirmMessage,
    linkToEntity,
    linkToList,
    modalSize,
    repository,
    transformForEditing,
    transformForCloning,
    transformOnCreate,
    transformOnUpdate,
  });

  const reloadList = async () => {
    reload?.();
  };

  return { create, ...actions, reloadList };
}

function cloneWithoutId<
  T1 extends Record<string, any>,
  T2 extends Record<string, any>
>(v: T1): T2 {
  const copy = { ...v } as any;
  if ("id" in copy) {
    copy["id"] = undefined;
  }
  return copy as unknown as T2;
}

function clone<T1 extends Record<string, any>, T2>(v: T1): T2 {
  const copy = { ...v } as any;
  return copy as unknown as T2;
}

export function useListItemActions<
  TRef extends Identifiable, // object in list with id
  Identifiable extends Record<string, any>, // object with id
  EditType extends Record<string, any> = Omit<TRef, keyof Identifiable> &
    Partial<Identifiable>, // object for editing
  SelectType extends Identifiable = TRef, //  object loaded from backend
  CreateType = Omit<SelectType, keyof Identifiable> & Partial<Identifiable>, // object for creating in backend
  UpdateType = Partial<Omit<SelectType, keyof Identifiable>> // object for updating in backend
>({
  reload,
  modal: Modal,
  editModalTitle = "Edit",
  deleteModalTitle = "Delete",
  editButtonLabel = "Save",
  deleteButtonLabel = "Delete",
  cancelButtonLabel = "Cancel",
  deleteConfirmMessage = (e) => "Are you sure?",
  linkToEntity,
  linkToList,
  modalSize,
  repository,
  transformForEditing = clone<SelectType, EditType>,
  transformForCloning = cloneWithoutId<SelectType, EditType>,
  transformOnCreate = clone<EditType, CreateType>,
  transformOnUpdate = clone<EditType, UpdateType>,
}: {
  reload?: () => void;
  modal: FC<ModalFormProps<EditType>>;
  editModalTitle?: string;
  deleteModalTitle?: string;
  editButtonLabel?: string;
  deleteButtonLabel?: string;
  cancelButtonLabel?: string;
  deleteConfirmMessage?: (entity: TRef) => ReactNode;
  linkToEntity?: (entity: Identifiable) => string;
  linkToList?: string;
  modalSize?: "sm" | "lg" | "xl";
  repository: DataRepository<SelectType, Identifiable, CreateType, UpdateType>;
  transformForEditing?: (v: SelectType) => EditType;
  transformForCloning?: (v: SelectType) => EditType;
  transformOnCreate?: (formData: EditType) => CreateType;
  transformOnUpdate?: (formData: EditType, origValue: SelectType) => UpdateType;
}): ListItemActions<TRef, Identifiable> {
  const { openModal, closeModal } = useModalContext();
  const { openConfirmModal } = useModals();

  const navigate = useNavigate();

  const edit = async (entity: TRef) => {
    const orig = await repository.findById(entity);
    openModal(
      <Modal
        title={editModalTitle}
        size={modalSize}
        handleClose={closeModal}
        submitButtonLabel={editButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        defaultValues={async () => {
          //      const v = await repository.findById(entity);
          //     c = v;
          return transformForEditing(orig);
        }}
        onSubmit={async (data) => {
          const d = transformOnUpdate(data, orig);
          const v = await repository.update(entity, d);
          reload?.();
          closeModal();
          if (linkToEntity) {
            navigate(linkToEntity(v));
          }
        }}
      />
    );
  };

  const copy = async (entity: TRef) => {
    openModal(
      <Modal
        title={editModalTitle}
        size={modalSize}
        handleClose={closeModal}
        submitButtonLabel={editButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        defaultValues={async () => {
          const v = await repository.findById(entity);
          console.log("copy1", entity, transformForCloning);

          const vv = transformForCloning(v);
          console.log("copy2", vv);
          return vv;
        }}
        onSubmit={async (data) => {
          const d = transformOnCreate(data);
          const v = await repository.create(d);
          reload?.();
          closeModal();
          if (linkToEntity) {
            navigate(linkToEntity(v));
          }
        }}
      />
    );
  };

  const remove = async (entity: TRef) => {
    openConfirmModal({
      title: deleteModalTitle,
      size: "lg",
      submitButtonLabel: deleteButtonLabel,
      cancelButtonLabel: cancelButtonLabel,
      children: deleteConfirmMessage(entity),
      onConfirm: async (closeModal) => {
        await repository.delete(entity);
        reload?.();
        closeModal();
        if (linkToList) {
          navigate(linkToList);
        }
      },
    });
  };

  return { edit, remove, copy };
}

export function useCreateAction<
  T extends Identifiable,
  Identifiable extends Record<string, any>,
  EditType extends Record<string, any> = Omit<T, keyof Identifiable> &
    Partial<Identifiable>,
  CreateType = EditType
>({
  reload,
  modal: Modal,
  modalTitle = "Create",
  createButtonLabel = "Save",
  cancelButtonLabel = "Cancel",
  linkToEntity,
  modalSize,
  create: createFn,
  defaultValues,
  transformOnCreate = (v) => v as unknown as CreateType,
}: {
  reload?: () => void;
  modal: FC<ModalFormProps<EditType>>;
  modalTitle?: string;
  createButtonLabel?: string;
  cancelButtonLabel?: string;
  linkToEntity?: (entity: T) => string;
  modalSize?: "sm" | "lg" | "xl";
  create: (item: CreateType) => Promise<T>;
  defaultValues?: () => any;
  transformOnCreate?: (v: EditType) => CreateType;
}) {
  const { openModal, closeModal } = useModalContext();
  const navigate = useNavigate();

  const create = async (values?: any) => {
    openModal(
      <Modal
        title={modalTitle}
        size={modalSize}
        handleClose={closeModal}
        submitButtonLabel={createButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        defaultValues={values || defaultValues?.()}
        onSubmit={async (data) => {
          const d = transformOnCreate(data);
          const v = await createFn(d);
          reload?.();
          closeModal();
          if (linkToEntity) {
            navigate(linkToEntity(v));
          }
        }}
      />
    );
  };

  return create;
}

export function ListItemButtons<
  T extends Identifiable,
  Identifiable extends Record<string, any>
>({
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
  actions: ListItemActions<T, Identifiable>;
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

function column<
  T extends Identifiable,
  Identifiable extends Record<string, any>
>(fn: (v: T) => ReactNode) {
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
  editDeleteButtons<
    T extends Identifiable,
    Identifiable extends Record<string, any>
  >(
    actions: ListItemActions<T, Identifiable>,
    ops: {
      before?: (v: T) => ReactNode;
      after?: (v: T) => ReactNode;
    } = {}
  ) {
    return column<T, Identifiable>((v) => (
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
    Identifiable extends Record<string, any>
  >(
    actions: ListItemActions<T, Identifiable>,
    ops: {
      before?: (v: T) => ReactNode;
      after?: (v: T) => ReactNode;
    } = {}
  ) {
    return column<T, Identifiable>((v) => (
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
