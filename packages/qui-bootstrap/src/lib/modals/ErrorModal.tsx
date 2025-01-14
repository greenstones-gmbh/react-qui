import { PropsWithChildren, ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

export interface ErrorModalProps extends PropsWithChildren {
  size?: "sm" | "lg" | "xl";
  title?: ReactNode;
  error?: unknown;
  closeButtonLabel?: string;
  handleClose: () => void;
}

export const ErrorModal = ({
  handleClose,
  title = "Error",
  error,
  closeButtonLabel = "Close",
  size = "lg",
  children,
}: ErrorModalProps) => {
  console.log("error", { error });

  return (
    <Modal
      show={true}
      size={size}
      onHide={handleClose}
      keyboard={true}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!error && (
          <>
            {(error as any)?.message}
            {/* <br />
            {JSON.stringify(error)} */}
          </>
        )}
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleClose()}>
          {closeButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
