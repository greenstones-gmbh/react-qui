import { PropsWithChildren, ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";
import { ActionButton } from "../buttons/ActionButton";

export interface ConfirmModalProps extends PropsWithChildren {
  handleClose: () => void;
  size?: "sm" | "lg" | "xl";
  onConfirm: (closeModal: () => void) => Promise<void>;
  onCancel?: () => void;
  title?: ReactNode;
  cancelButtonLabel?: string;
  submitButtonLabel?: string;
}

export const ConfirmModal = ({
  handleClose,
  title = "Confirm",
  children = "Are you sure?",
  cancelButtonLabel = "Cancel",
  submitButtonLabel = "Execute",
  size = "sm",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const cancel = () => {
    handleClose();
    onCancel?.();
  };

  return (
    <Modal show={true} size={size} onHide={cancel} keyboard={true} centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => cancel()}>
          {cancelButtonLabel}
        </Button>
        <ActionButton
          variant="primary"
          onClick={async () => onConfirm(handleClose)}
        >
          {submitButtonLabel}
        </ActionButton>
      </Modal.Footer>
    </Modal>
  );
};
