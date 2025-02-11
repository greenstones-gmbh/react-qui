import { DataRepository, useModalContext } from "@clickapp/qui-core";
import {
  ModalFormActionOptions,
  ListItemAction,
  FormTransformOptions,
} from "./utils";

interface RepositoryOptions<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>
> {
  repository: DataRepository<
    RepositoryType,
    Identifiable,
    RepositoryUpdateType,
    unknown
  >;
}

interface BaseCopyActionOptions<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>,
  FormFields
> extends ModalFormActionOptions<RepositoryType, FormFields>,
    FormTransformOptions<RepositoryType, RepositoryUpdateType, FormFields>,
    RepositoryOptions<Identifiable, RepositoryType, RepositoryUpdateType> {}

export function useBaseCopyAction<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>,
  FormValues = Partial<RepositoryType>
>({
  repository,
  onSuccess,
  modal,
  toFormValues,
  toUpdateValues,
}: BaseCopyActionOptions<
  Identifiable,
  RepositoryType,
  RepositoryUpdateType,
  FormValues
>): ListItemAction<Identifiable> {
  const { openModal, closeModal } = useModalContext();

  return async (id) => {
    const value: RepositoryType = await repository.findById(id);
    const formValues: FormValues = toFormValues(value);

    const handleSubmit = async (formValues: FormValues) => {
      const updateValues = toUpdateValues(formValues);
      const v = await repository.create(updateValues);
      closeModal();
      onSuccess?.(v);
    };

    openModal(
      modal({
        defaultValues: formValues,
        handleSubmit,
        handleClose: closeModal,
      })
    );
  };
}

export function useCopyAction<
  Type extends Record<string, any>,
  Identifiable extends Record<string, any>
>({
  repository,
  modal,
  onSuccess,
  toFormValues = (v) => {
    const empties = unsetKeys.reduce((pv, cv) => {
      pv[cv] = undefined;
      return pv;
    }, {} as any);
    const formValues: Partial<Type> = { ...v, ...empties };
    return formValues;
  },
  toUpdateValues = (v) => {
    return { ...v };
  },
  unsetKeys = ["id"],
}: {
  repository: DataRepository<Type, Identifiable, unknown, Partial<Type>>;
  unsetKeys?: (keyof Type)[];
} & ModalFormActionOptions<Type, Partial<Type>> &
  Partial<FormTransformOptions<Type, Partial<Type>, Partial<Type>>>) {
  return useBaseCopyAction<Identifiable, Type, Partial<Type>, Partial<Type>>({
    repository,
    modal,
    onSuccess,
    toFormValues,
    toUpdateValues,
  });
}
