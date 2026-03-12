import { type ReactNode } from "react";
import { ConfirmModal } from "../modals/ConfirmModal";
import { OpenModalButton } from "./OpenModalButton";

export function ConfirmButton({
  onClick,
  confirmTitle,
  confirmBody,
  confirmCancelButtonLabel,
  confirmSubmitButtonLabel,
  confirmSize,

  label = "Edit",
  size = "sm",
  variant = "outline-primary",
  className,
  disabled,
}: {
  onClick: () => Promise<void>;
  confirmTitle?: ReactNode;
  confirmBody?: ReactNode;
  confirmCancelButtonLabel?: string;
  confirmSubmitButtonLabel?: string;
  confirmSize?: "sm" | "lg" | "xl";

  label?: string;
  size?: "sm" | "lg";

  variant?: string;
  className?: string;
  disabled?: boolean;
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
          <ConfirmModal
            title={confirmTitle}
            cancelButtonLabel={confirmCancelButtonLabel}
            submitButtonLabel={confirmSubmitButtonLabel}
            handleClose={close}
            size={confirmSize}
            onConfirm={async () => {
              await onClick();
              close();
            }}
            message={confirmBody}
          ></ConfirmModal>
        );
      }}
    />
  );
}
