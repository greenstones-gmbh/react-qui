import {
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  useState,
} from "react";
import { Spinner } from "react-bootstrap";
import { useModals } from "../modals/Modals";

export interface ActionLinkProps extends PropsWithChildren {
  label?: string;
  disabled?: boolean;
  onClick: (event: any) => Promise<void> | void;
  errorTitle?: string;
  errorBody?: (error: unknown) => ReactNode;
  className?: string;
  spinner?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

export const ActionLink = ({
  onClick,
  children,
  disabled,
  className,
  errorTitle = "Action Failed",
  errorBody,
  spinner,
  ref,
  label,
  ...props
}: ActionLinkProps) => {
  const [running, setRunning] = useState(false);
  const { showErrorMessage } = useModals();

  return (
    <>
      <a
        {...props}
        className={className}
        ref={ref}
        onClick={(e) => {
          setRunning(true);
          e.preventDefault();
          e.stopPropagation();

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
        {label || children}
      </a>
      {/* <Spinner animation="grow" size="sm" className="ms-2" /> */}
    </>
  );
};
