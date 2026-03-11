import { useModalContext } from "@clickapp/qui-core";
import { type ReactNode } from "react";
import { Button } from "react-bootstrap";

export function OpenModalButton({
  label,
  variant,
  size,
  modal,
  className,
  disabled,
}: {
  label: ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
  disabled?: boolean;
  modal: (close: () => void) => JSX.Element;
}) {
  const { openModal, closeModal } = useModalContext();

  return (
    <Button
      disabled={disabled}
      variant={variant}
      onClick={() => {
        openModal(modal(closeModal));
      }}
      className={className}
      size={size}
    >
      {label}
    </Button>
  );
}
