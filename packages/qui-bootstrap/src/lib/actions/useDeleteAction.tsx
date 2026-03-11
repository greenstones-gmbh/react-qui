import { type DataRepository, useModalContext } from "@greenstones/qui-core";
import type { PropsWithChildren, ReactElement } from "react";
import { type ListItemAction } from "./utils";

export interface ConfirmModalControllerProps<
  Identifiable,
> extends PropsWithChildren {
  handleClose: () => void;
  onConfirm: (closeModal: () => void) => Promise<void>;
  value: Identifiable;
}

export interface ConfirmModalActionOptions<Identifiable> {
  onSuccess?: (value: unknown) => void;
  modal: (props: ConfirmModalControllerProps<Identifiable>) => ReactElement;
}

interface RepositoryOptions<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
> {
  repository: DataRepository<RepositoryType, Identifiable, unknown, unknown>;
}

interface BaseDeleteActionOptions<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
>
  extends
    ConfirmModalActionOptions<Identifiable>,
    RepositoryOptions<Identifiable, RepositoryType> {}

export function useDeleteAction<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
>({
  repository,
  onSuccess,
  modal,
}: BaseDeleteActionOptions<
  Identifiable,
  RepositoryType
>): ListItemAction<Identifiable> {
  const { openModal, closeModal } = useModalContext();

  return async (id) => {
    const onConfirm = async (closeModal: () => void) => {
      const v = await repository.delete(id);
      closeModal();
      onSuccess?.(v);
    };

    openModal(
      modal({
        value: id,
        onConfirm,
        handleClose: closeModal,
      }),
    );
  };
}
