import type { ReactElement } from "react";

export type ListItemAction<T> = (entity: T) => Promise<void>;

export interface ModalFormControllerProps<FormFields> {
  defaultValues: FormFields;
  handleSubmit: (formValues: FormFields) => Promise<void>;
  handleClose: () => void;
}

export interface ModalFormActionOptions<
  RepositoryType extends Record<string, any>,
  FormFields,
> {
  onSuccess?: (value: RepositoryType) => void;
  modal: (props: ModalFormControllerProps<FormFields>) => ReactElement;
}

export interface FormTransformOptions<
  RepositoryType extends Record<string, any>,
  RepositoryUpdateType extends Record<string, any>,
  FormFields,
> {
  toFormValues: (v: RepositoryType) => FormFields;
  toUpdateValues: (v: FormFields) => RepositoryUpdateType;
}

export interface NavigationProps<Type> {
  path: (v: Type) => string;
  listPath: string;
  view?: "list" | "detail";
  navigateAfterEdit?: boolean;
  navigateAfterDelete?: boolean;
  navigateAfterCopy?: boolean;
  navigateAfterCreate?: boolean;
}
