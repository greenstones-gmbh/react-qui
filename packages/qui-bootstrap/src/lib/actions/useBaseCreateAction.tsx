import { useModalContext } from "@clickapp/qui-core";
import { ModalFormActionOptions } from "./utils";

export function useBaseCreateAction<
  RepositoryType extends Record<string, any>,
  FormValues = Partial<RepositoryType>
>({
  onSuccess,
  modal,
  defaultFormValues,
  create,
}: ModalFormActionOptions<RepositoryType, FormValues> & {
  create: (item: FormValues) => Promise<RepositoryType>;
  defaultFormValues: () => Partial<FormValues>;
}) {
  const { openModal, closeModal } = useModalContext();

  return async (df?: Partial<FormValues> | undefined) => {
    const formValues: FormValues = {
      ...defaultFormValues(),
      ...df,
    } as FormValues;

    const handleSubmit = async (formValues: FormValues) => {
      console.log("handleSubmit", formValues);
      const v = await create(formValues);
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
