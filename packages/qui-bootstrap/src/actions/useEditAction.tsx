import { type DataRepository, useModalContext } from "@greenstones/qui-core";
import {
  type ModalFormActionOptions,
  type FormTransformOptions,
  type ListItemAction,
} from "./utils";

interface RepositoryOptions<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>
> {
  repository: DataRepository<
    RepositoryType,
    Identifiable,
    unknown,
    RepositoryUpdateType
  >;
}

interface BaseEditActionOptions<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>,
  FormFields
> extends ModalFormActionOptions<RepositoryType, FormFields>,
    FormTransformOptions<RepositoryType, RepositoryUpdateType, FormFields>,
    RepositoryOptions<Identifiable, RepositoryType, RepositoryUpdateType> {}

export function useBaseEditAction<
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
}: BaseEditActionOptions<
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
      const v = await repository.update(id, updateValues);
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

export function useEditAction<
  Type extends Record<string, any>,
  Identifiable extends Record<string, any>
>({
  repository,
  modal,
  onSuccess,
}: {
  repository: DataRepository<Type, Identifiable, unknown, Partial<Type>>;
} & ModalFormActionOptions<Type, Partial<Type>>) {
  return useBaseEditAction<Identifiable, Type, Partial<Type>, Partial<Type>>({
    repository,
    modal,
    onSuccess,
    toFormValues: (v) => {
      const formValues: Partial<Type> = { ...v };
      return formValues;
    },
    toUpdateValues: (v) => {
      return { ...v };
    },
  });
}
