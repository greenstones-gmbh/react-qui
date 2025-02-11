import { DataRepository, useModalContext } from "@clickapp/qui-core";
import { ModalFormActionOptions } from "./utils";

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

interface CreateFormTransformOptions<
  RepositoryUpdateType extends Record<string, any>,
  FormFields
> {
  defaultFormValues: () => Partial<FormFields>;
  toUpdateValues: (v: FormFields) => RepositoryUpdateType;
}

interface BaseCreateActionOptions<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>,
  FormFields
> extends ModalFormActionOptions<RepositoryType, FormFields>,
    CreateFormTransformOptions<RepositoryUpdateType, FormFields>,
    RepositoryOptions<Identifiable, RepositoryType, RepositoryUpdateType> {}

export function useBaseCreateAction<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>,
  FormValues = Partial<RepositoryType>
>({
  repository,
  onSuccess,
  modal,
  defaultFormValues,
  toUpdateValues,
}: BaseCreateActionOptions<
  Identifiable,
  RepositoryType,
  RepositoryUpdateType,
  FormValues
>) {
  const { openModal, closeModal } = useModalContext();

  return async (df?: Partial<FormValues> | undefined) => {
    const formValues: FormValues = {
      ...defaultFormValues(),
      ...df,
    } as FormValues;

    const handleSubmit = async (formValues: FormValues) => {
      console.log("handleSubmit", formValues);
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

export function useCreateAction<
  Type extends Record<string, any>,
  Identifiable extends Record<string, any>
>({
  repository,
  modal,
  onSuccess,
  defaultFormValues = () => ({}),
  toUpdateValues = (v) => {
    return { ...v };
  },
}: {
  repository: DataRepository<Type, Identifiable, unknown, Partial<Type>>;
} & ModalFormActionOptions<Type, Partial<Type>> &
  Partial<CreateFormTransformOptions<Partial<Type>, Partial<Type>>>) {
  return useBaseCreateAction<Identifiable, Type, Partial<Type>, Partial<Type>>({
    repository,
    modal,
    onSuccess,
    defaultFormValues,
    toUpdateValues,
  });
}
