import { PropsWithChildren, ReactNode, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useModals } from "../modals/Modals";

export interface ActionButtonProps extends ActionButtonDisplayProps {
  disabled?: boolean;
  onClick: (event: any) => Promise<void> | void;
  errorTitle?: string;
  errorBody?: (error: unknown) => ReactNode;
}

export interface ActionButtonDisplayProps extends PropsWithChildren {
  hideLabelOnRunning?: boolean;
  variant?: string;
  className?: string;
  size?: "sm" | "lg";
  label?: string;
}

export const ActionButton = ({
  onClick,
  children,
  disabled,
  hideLabelOnRunning = false,
  variant,
  size,
  className,
  errorTitle = "Action Failed",
  errorBody,
  label,
  ...props
}: ActionButtonProps) => {
  const [running, setRunning] = useState(false);
  const { showErrorMessage } = useModals();

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
          try {
            await onClick(e);
            setRunning(false);
          } catch (error) {
            setRunning(false);
            showErrorMessage({
              error: errorBody ? null : error,
              title: errorTitle,
              children: errorBody?.(error),
            });
          }
        };

        if (!running) {
          fn();
        }
      }}
    >
      {running && <Spinner size="sm" animation="border" />}{" "}
      {(!running || (running && !hideLabelOnRunning)) && (label || children)}
    </Button>
  );
};
