import { type DataRepository } from "@greenstones/qui-core";

import type { ReactElement, ReactNode } from "react";
import { useBaseCopyAction, useCopyAction } from "./useCopyAction";
import { useDeleteAction } from "./useDeleteAction";
import { useBaseEditAction, useEditAction } from "./useEditAction";
import {
  type FormTransformOptions,
  type ModalFormControllerProps,
  type NavigationProps,
} from "./utils";
import { useNavigate } from "react-router-dom";
import {
  ConfirmModal,
  type ConfirmModalDisplayProps,
  type ModalFormDisplayProps,
  type ModalFormProps,
} from "../modals";

export function useBaseListItemActions<
  RepositoryType extends Record<string, any>,
  Identifiable extends Record<string, any>,
  RepositoryCreateType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>,
  FormFields extends Record<string, any>,
>({
  repository,
  onSuccess,
  modal,
  editProps,
  copyProps,
  deleteProps,
}: {
  repository: DataRepository<
    RepositoryType,
    Identifiable,
    RepositoryCreateType,
    RepositoryUpdateType
  >;

  onSuccess?: (type: "edit" | "delete" | "copy", value: unknown) => void;

  modal: (props: ModalFormProps<FormFields>) => ReactElement;
  editProps: {
    modalProps: ModalFormDisplayProps;
    transform: FormTransformOptions<
      RepositoryType,
      RepositoryUpdateType,
      FormFields
    >;
  };
  copyProps: {
    modalProps: ModalFormDisplayProps;
    transform: FormTransformOptions<
      RepositoryType,
      RepositoryCreateType,
      FormFields
    >;
  };

  deleteProps: {
    modalProps: ConfirmModalDisplayProps;
    message: (v: Identifiable) => ReactNode;
  };
}) {
  // const navigate = useNavigate();

  // const onEditSuccess = (v: RepositoryType) => {
  //   onSuccess?.();
  //   navigate(linkToEntity(v));
  // };

  // const onCopySuccess = (v: RepositoryType) => {
  //   onSuccess?.();
  //   navigate(linkToEntity(v));
  // };

  // const onDeleteSuccess = (v: RepositoryType) => {
  //   onSuccess?.();
  //   navigate(linkToEntity(v));
  // };

  const edit = useBaseEditAction({
    repository,

    modal: (props: ModalFormControllerProps<FormFields>) =>
      modal({
        ...props,
        onSubmit: props.handleSubmit,
        defaultValues: async () => props.defaultValues,
        ...editProps.modalProps,
      }),
    onSuccess: (v) => onSuccess?.("edit", v),
    ...editProps.transform,
  });

  const copy = useBaseCopyAction({
    repository,
    modal: (props: ModalFormControllerProps<FormFields>) =>
      modal({
        ...props,
        onSubmit: props.handleSubmit,
        defaultValues: async () => props.defaultValues,
        ...copyProps.modalProps,
      }),
    onSuccess: (v) => onSuccess?.("copy", v),
    ...copyProps.transform,
  });

  const remove = useDeleteAction({
    repository,
    modal: ({ value, ...rest }) => (
      <ConfirmModal
        {...rest}
        {...deleteProps.modalProps}
        message={deleteProps.message(value)}
      />
    ),
    onSuccess: (v) => onSuccess?.("delete", v),
  });

  return { edit, remove, copy };
}

export function useListItemActions<
  RepositoryType extends Record<string, any>,
  Identifiable extends Record<string, any>,
>({
  repository,
  navigationProps,

  modal,

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
  onSuccess,
}: {
  repository: DataRepository<
    RepositoryType,
    Identifiable,
    Partial<RepositoryType>,
    Partial<RepositoryType>
  >;
  onSuccess?: (type: "edit" | "delete" | "copy", value: unknown) => void;
  modal: (props: ModalFormProps<Partial<RepositoryType>>) => ReactElement;

  editTitle?: string;
  editButtonLabel?: string;
  copyTitle?: string;
  copyButtonLabel?: string;
  cancelButtonLabel?: string;
  deleteTitle?: string;
  deleteMessage?: (v: Identifiable) => ReactNode;
  deleteButtonLabel?: string;
  modalFormSize?: "sm" | "lg" | "xl";
  deleteModalSize?: "sm" | "lg" | "xl";
  unsetKeysOnCopy?: (keyof RepositoryType)[];

  navigationProps?: NavigationProps<RepositoryType>;
}) {
  const navigate = useNavigate();

  const view = navigationProps?.view ?? "list";

  let navigateAfterEdit = true;
  let navigateAfterCopy = true;
  let navigateAfterDelete = true;

  if (view === "list") {
    navigateAfterEdit = true;
    navigateAfterCopy = true;
    navigateAfterDelete = true;
  }

  if (view === "detail") {
    navigateAfterEdit = false;
    navigateAfterCopy = true;
    navigateAfterDelete = true;
  }

  if (navigationProps?.navigateAfterCopy != null) {
    navigateAfterCopy = navigationProps?.navigateAfterCopy;
  }

  if (navigationProps?.navigateAfterEdit != null) {
    navigateAfterEdit = navigationProps?.navigateAfterEdit;
  }

  if (navigationProps?.navigateAfterDelete != null) {
    navigateAfterDelete = navigationProps?.navigateAfterDelete;
  }

  const onEdit = (v: RepositoryType) => {
    onSuccess?.("edit", v);
    if (navigationProps) {
      if (navigateAfterEdit) {
        navigate(navigationProps.path(v));
      }
    }
  };

  const onCopy = (v: RepositoryType) => {
    onSuccess?.("copy", v);
    if (navigationProps) {
      if (navigateAfterCopy) {
        navigate(navigationProps.path(v));
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onDelete = (v: Identifiable) => {
    onSuccess?.("delete", v);
    if (navigationProps) {
      if (navigateAfterDelete) {
        navigate(navigationProps.listPath);
      }
    }
  };

  const edit = useEditAction({
    repository,
    modal: (props: ModalFormControllerProps<Partial<RepositoryType>>) =>
      modal({
        ...props,
        onSubmit: props.handleSubmit,
        defaultValues: async () => props.defaultValues,
        title: editTitle,
        submitButtonLabel: editButtonLabel,
        cancelButtonLabel,
        size: modalFormSize,
      }),
    onSuccess: onEdit,
  });

  const copy = useCopyAction({
    repository,
    modal: (props) =>
      modal({
        ...props,
        onSubmit: props.handleSubmit,
        defaultValues: async () => props.defaultValues,
        title: copyTitle,
        submitButtonLabel: copyButtonLabel,
        cancelButtonLabel,
        size: modalFormSize,
      }),
    onSuccess: onCopy,
    unsetKeys: unsetKeysOnCopy,
  });

  const remove = useDeleteAction({
    repository,
    modal: ({ value, ...props }) => (
      <ConfirmModal
        {...props}
        title={deleteTitle}
        message={deleteMessage(value)}
        cancelButtonLabel={cancelButtonLabel}
        submitButtonLabel={deleteButtonLabel}
        size={deleteModalSize}
      />
    ),
    onSuccess: (v) => onDelete?.(v as Identifiable),
  });

  return { edit, copy, remove };
}
