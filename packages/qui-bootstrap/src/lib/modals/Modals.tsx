import { useModalContext } from "@greenstones/qui-core";
import { ConfirmModal, type ConfirmModalProps } from "./ConfirmModal";
import { ErrorModal, type ErrorModalProps } from "./ErrorModal";
import { MessageModal, type MessageModalProps } from "./MessageModal";

export function useModals() {
  const { openModal, closeModal } = useModalContext();
  const openConfirmModal = (props: Omit<ConfirmModalProps, "handleClose">) => {
    openModal(<ConfirmModal handleClose={closeModal} {...props} />);
  };

  const showErrorMessage = (props: Omit<ErrorModalProps, "handleClose">) => {
    return new Promise<boolean>((resolve, reject) => {
      const close = () => {
        closeModal();
        resolve(true);
      };
      openModal(<ErrorModal handleClose={close} {...props} />);
    });
  };

  const showMessage = (props: Omit<MessageModalProps, "handleClose">) => {
    return new Promise<boolean>((resolve, reject) => {
      const close = () => {
        closeModal();
        resolve(true);
      };
      openModal(<MessageModal handleClose={close} {...props} />);
    });
  };

  const confirm = (
    props: Omit<ConfirmModalProps, "handleClose" | "onConfirm">
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      openConfirmModal({
        ...props,
        onConfirm: async (closeModal) => {
          closeModal();
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  };
  return { openConfirmModal, confirm, showErrorMessage, showMessage };
}
