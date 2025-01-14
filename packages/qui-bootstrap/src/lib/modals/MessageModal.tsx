import { PropsWithChildren, ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

export interface MessageModalProps extends PropsWithChildren {
  handleClose: () => void;
  size?: "sm" | "lg" | "xl";
  title?: ReactNode;
  closeButtonLabel?: string;
}

export const MessageModal = ({
  handleClose,
  title = "Message",
  children = "text",
  closeButtonLabel = "Close",
  size = "sm",
}: MessageModalProps) => {
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
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleClose()}>
          {closeButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
