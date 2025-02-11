import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";
import { ActionButton } from "../buttons/ActionButton";

export interface ConfirmModalDisplayProps {
  size?: "sm" | "lg" | "xl";
  title?: ReactNode;
  cancelButtonLabel?: string;
  submitButtonLabel?: string;
  message?: ReactNode;
}

export interface ConfirmModalProps extends ConfirmModalDisplayProps {
  handleClose: () => void;
  onConfirm: (closeModal: () => void) => Promise<void>;
  onCancel?: () => void;
}

export const ConfirmModal = ({
  handleClose,
  title = "Confirm",
  message = "Are you sure?",
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
      <Modal.Body>{message}</Modal.Body>
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
