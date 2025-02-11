import { FC } from "react";
import { DefaultValues, FieldValues } from "react-hook-form";
import { ModalFormProps } from "../modals/ModalForm";
import { OpenModalButton } from "./OpenModalButton";

export function OpenModalFormButton<Type extends FieldValues>({
  defaultValues,
  onSubmit,

  modal: Modal,
  modalTitle = "Edit Entity",
  modalCancelButtonLabel,
  modalSubmitButtonLabel,
  disabled,

  label = "Edit",
  size = "sm",
  variant = "outline-primary",
  className,
}: {
  modal: FC<ModalFormProps<Type>>;

  defaultValues?: DefaultValues<Type> | ((payload?: unknown) => Promise<Type>);
  onSubmit: (data: Type) => Promise<void>;

  label?: string;
  size?: "sm" | "lg";
  variant?: string;
  className?: string;
  disabled?: boolean;

  modalTitle?: string;
  modalCancelButtonLabel?: string;
  modalSubmitButtonLabel?: string;
}) {
  return (
    <OpenModalButton
      variant={variant}
      size={size}
      label={label}
      className={className}
      disabled={disabled}
      modal={(close) => {
        return (
          <Modal
            title={modalTitle}
            cancelButtonLabel={modalCancelButtonLabel}
            submitButtonLabel={modalSubmitButtonLabel}
            handleClose={close}
            defaultValues={defaultValues}
            //context={context}
            onSubmit={async (data: Type) => {
              await onSubmit(data);
              close();
            }}
          />
        );
      }}
    />
  );
}
