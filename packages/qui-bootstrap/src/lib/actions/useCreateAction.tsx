import { type DataRepository } from "@clickapp/qui-core";
import { type ModalFormActionOptions } from "./utils";
import { useBaseCreateAction } from "./useBaseCreateAction";

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

interface RepositoryCreateActionOptions<
  Identifiable extends Record<string, any>,
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>,
  FormFields
> extends ModalFormActionOptions<RepositoryType, FormFields>,
    CreateFormTransformOptions<RepositoryUpdateType, FormFields>,
    RepositoryOptions<Identifiable, RepositoryType, RepositoryUpdateType> {}

export function useRepositoryCreateAction<
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
}: RepositoryCreateActionOptions<
  Identifiable,
  RepositoryType,
  RepositoryUpdateType,
  FormValues
>) {
  const create = async (formValues: FormValues) => {
    const updateValues = toUpdateValues(formValues);
    const v = await repository.create(updateValues);
    return v;
  };

  return useBaseCreateAction<RepositoryType, FormValues>({
    create,
    modal,
    onSuccess,
    defaultFormValues,
  });
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
  return useRepositoryCreateAction<
    Identifiable,
    Type,
    Partial<Type>,
    Partial<Type>
  >({
    repository,
    modal,
    onSuccess,
    defaultFormValues,
    toUpdateValues,
  });
}
