import { FC, ReactNode } from "react";
import { ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "../buttons/ActionButton";
import { useModals } from "../modals/Modals";
import { ModalFormProps } from "../modals/ModalForm";
import { EntityHandlers, useModalContext } from "@clickapp/qui-core";

export function useEntityActions<
  EntityKey,
  EntityFields extends Record<string, any>,
  EntityWithId extends EntityKey & EntityFields
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
  handlers,
}: {
  reload?: () => {};
  modal: FC<ModalFormProps<EntityFields>>;
  createModalTitle?: string;
  editModalTitle?: string;
  deleteModalTitle?: string;
  createButtonLabel?: string;
  editButtonLabel?: string;
  deleteButtonLabel?: string;
  cancelButtonLabel?: string;
  deleteConfirmMessage?: (entity: EntityWithId) => ReactNode;
  linkToEntity?: (entity: EntityWithId) => string;
  linkToList?: string;
  modalSize?: "sm" | "lg" | "xl";
  handlers: EntityHandlers<EntityKey, EntityWithId, EntityFields>;
}) {
  const { openModal, closeModal } = useModalContext();
  const { openConfirmModal } = useModals();

  const navigate = useNavigate();

  const create = useCreateEntityAction({
    reload,
    modal: Modal,
    modalTitle: createModalTitle,
    createButtonLabel,
    cancelButtonLabel,
    linkToEntity,
    modalSize,
    insert: handlers.insert,
  });
  // const create = (defaultValues: any) => {
  //   openModal(
  //     <Modal
  //       title={createModalTitle}
  //       size={modalSize}
  //       handleClose={closeModal}
  //       submitButtonLabel={createButtonLabel}
  //       cancelButtonLabel={cancelButtonLabel}
  //       defaultValues={defaultValues}
  //       onSubmit={async (data) => {
  //         const v = await handlers.insert(data);
  //         reload?.();
  //         closeModal();
  //         if (linkToEntity) {
  //           navigate(linkToEntity(v));
  //         }
  //       }}
  //     />
  //   );
  // };

  const edit = (entity: EntityKey, skipNavigate = false) => {
    openModal(
      <Modal
        title={editModalTitle}
        size={modalSize}
        handleClose={closeModal}
        submitButtonLabel={editButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        defaultValues={async () => await handlers.findById(entity)}
        onSubmit={async (data) => {
          const v = await handlers.update(entity, data);
          reload?.();
          closeModal();
          if (linkToEntity && !skipNavigate) {
            navigate(linkToEntity(v));
          }
        }}
      />
    );
  };

  const copy = (entity: EntityKey, skipNavigate = false) => {
    openModal(
      <Modal
        title={editModalTitle}
        size={modalSize}
        handleClose={closeModal}
        submitButtonLabel={editButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        defaultValues={async () => await handlers.copyFields(entity)}
        onSubmit={async (data) => {
          const v = await handlers.insert(data);
          reload?.();
          closeModal();
          if (linkToEntity && !skipNavigate) {
            navigate(linkToEntity(v));
          }
        }}
      />
    );
  };

  const removeAction = (entity: EntityWithId, skipNavigate = false) => {
    openConfirmModal({
      title: deleteModalTitle,
      size: "lg",
      submitButtonLabel: deleteButtonLabel,
      cancelButtonLabel: cancelButtonLabel,
      children: deleteConfirmMessage(entity),
      onConfirm: async (closeModal) => {
        await handlers.remove(entity);
        reload?.();
        closeModal();
        if (linkToList && !skipNavigate) {
          navigate(linkToList);
        }
      },
    });
  };

  return { create, edit, remove: removeAction, copy };
}

export function useCreateEntityAction<
  EntityKey,
  EntityFields extends Record<string, any>,
  EntityWithId extends EntityKey
>({
  reload,
  modal: Modal,
  modalTitle = "Create",
  createButtonLabel = "Save",
  cancelButtonLabel = "Cancel",
  linkToEntity,
  modalSize,
  insert,
}: {
  reload?: () => {};
  modal: FC<ModalFormProps<EntityFields>>;
  modalTitle?: string;
  createButtonLabel?: string;
  cancelButtonLabel?: string;
  linkToEntity?: (entity: EntityWithId) => string;
  modalSize?: "sm" | "lg" | "xl";
  insert: (fields: EntityFields) => Promise<EntityWithId>;
}) {
  const { openModal, closeModal } = useModalContext();
  const navigate = useNavigate();

  const create = (defaultValues: any) => {
    openModal(
      <Modal
        title={modalTitle}
        size={modalSize}
        handleClose={closeModal}
        submitButtonLabel={createButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        defaultValues={defaultValues}
        onSubmit={async (data) => {
          const v = await insert(data);
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

export function EntityActionButtons<EntityWithId>({
  entity,
  actions,
  skipNavigate,
  size = "sm",
  variant = "outline-primary",
  className,
  labelEdit = "Edit",
  labelDelete = "Delete",
  labelCopy = "Kopieren",
  hideCopy = false,
  disabled,
}: {
  entity: EntityWithId;
  actions: {
    edit: (entity: EntityWithId, skipNavigate?: boolean) => void;
    remove: (entity: EntityWithId, skipNavigate?: boolean) => void;
    copy: (entity: EntityWithId, skipNavigate?: boolean) => void;
  };
  skipNavigate?: boolean;
  size?: "sm" | "lg";
  variant?: string;
  className?: string;
  labelEdit?: string;
  labelDelete?: string;
  labelCopy?: string;
  hideCopy?: boolean;
  disabled?: boolean;
}) {
  return (
    <ButtonGroup className={className}>
      <ActionButton
        size={size}
        variant={variant}
        disabled={disabled}
        onClick={async (e) => actions.edit(entity, skipNavigate)}
      >
        {labelEdit}
      </ActionButton>
      {!hideCopy && (
        <ActionButton
          size={size}
          variant={variant}
          disabled={disabled}
          onClick={async (e) => actions.copy(entity, skipNavigate)}
        >
          {labelCopy}
        </ActionButton>
      )}
      <ActionButton
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={async (e) => actions.remove(entity, skipNavigate)}
      >
        {labelDelete}
      </ActionButton>
    </ButtonGroup>
  );
}
