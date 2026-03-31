import { useModalContext } from "@greenstones/qui-core";
import { type CSSProperties, type ReactElement, type ReactNode } from "react";
import { Button } from "react-bootstrap";

export function OpenModalButton({
  label,
  variant,
  size,
  modal,
  className,
  disabled,
  style,
}: {
  label: ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
  disabled?: boolean;
  style?: CSSProperties;
  modal: (close: () => void) => ReactElement;
}) {
  const { openModal, closeModal } = useModalContext();

  return (
    <Button
      style={style}
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
