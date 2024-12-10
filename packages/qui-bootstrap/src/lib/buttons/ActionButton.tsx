import { PropsWithChildren, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

export const ActionButton = ({
  onClick,
  children,
  disabled,
  hideLabelOnRunning = false,
  variant,
  size,
  className,
  ...props
}: PropsWithChildren<{
  disabled?: boolean;
  hideLabelOnRunning?: boolean;
  onClick: (event: any) => Promise<void>;
  variant?: string;
  className?: string;
  size?: "sm" | "lg";
}>) => {
  const [running, setRunning] = useState(false);

  return (
    <Button
      {...props}
      variant={variant}
      disabled={disabled || running}
      className={className}
      size={size}
      onClick={(e) => {
        setRunning(true);

        const fn = async () => {
          await onClick(e);
          setRunning(false);
        };

        !running && fn();
      }}
    >
      {running && <Spinner size="sm" animation="border" />}{" "}
      {(!running || (running && !hideLabelOnRunning)) && children}
    </Button>
  );
};
