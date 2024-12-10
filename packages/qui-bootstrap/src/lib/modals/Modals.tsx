import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";
//import { create } from "zustand";
import "./Modals.css";

interface ModalState {
  modals: JSX.Element[];
  close: () => void;
  open: (modal: any) => void;
}

// export const useModalStore = create<ModalState>((set) => ({
//   modals: [],
//   open: (modal) => set((state) => ({ modals: [...state.modals, modal] })),
//   close: () =>
//     set((state) => {
//       var a = [...state.modals];
//       a.pop();
//       return { modals: a };
//     }),
// }));

// export const openModal = (factory: (close: { close: () => void }) => void) => {
//   const m = factory({ close: useModalStore.getState().close });
//   useModalStore.getState().open(m);
// };

// export function ModalProvider({ children }: PropsWithChildren<{}>) {
//   const modals = useModalStore((state) => state.modals);
//   const params = useParams();
//   console.log("ModalProvider", params);

//   return (
//     <>
//       {modals &&
//         modals.map((m, index) =>
//           React.cloneElement(m, {
//             backdropClassName: `backdrop-level-${index}`,
//             className: `modal-level-${index}`,
//           })
//         )}
//       {children}
//     </>
//   );
// }

// export const ConfirmModal = ({
//   handleClose,
//   title,
//   children,
//   onSubmit,
//   size,
//   successButtonLabel = "Confirm",
//   ...props
// }) => {
//   return (
//     <Modal
//       show={true}
//       size={size}
//       onHide={handleClose}
//       //   backdrop="static"
//       keyboard={true}
//       {...props}
//     >
//       <Modal.Header closeButton>
//         <Modal.Title as="h5">{title}</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>{children}</Modal.Body>
//       <Modal.Footer>
//         <ActionButton variant="secondary" onClick={handleClose}>
//           Cancel
//         </ActionButton>
//         <ActionButton variant="primary" onClick={onSubmit}>
//           {successButtonLabel}
//         </ActionButton>
//       </Modal.Footer>
//     </Modal>
//   );
// };

export interface MessageModalProps {
  title: string;
  message: ReactNode;
  buttonLabel?: string;
  size?: "sm" | "lg" | "xl";
}

export interface MessageModalControl {
  handleClose: () => void;
}

function MessageModal({
  handleClose,
  title,
  message,
  size,
  buttonLabel = "Schlissen",
  ...props
}: MessageModalProps & MessageModalControl) {
  return (
    <Modal
      show={true}
      size={size}
      onHide={handleClose}
      //   backdrop="static"
      keyboard={true}
      scrollable={true}
      {...props}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          {buttonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// export const showMessage = (props: MessageModalProps) => {
//   const m = (
//     <MessageModal handleClose={useModalStore.getState().close} {...props} />
//   );
//   useModalStore.getState().open(m);
// };

// export const openConfirm = (
//   title,
//   message,
//   successButtonLabel,
//   onSubmit,
//   onCancel
// ) => {
//   openModal(({ close }) => (
//     <ConfirmModal
//       title={title}
//       handleClose={onCancel ? () => onCancel({ close }) : close}
//       successButtonLabel={successButtonLabel}
//       onSubmit={async (v) => {
//         try {
//           const result = await onSubmit({ value: v, close });
//         } catch (error) {
//           close();
//           showErrorModal(error);
//         }
//       }}
//     >
//       {message}
//     </ConfirmModal>
//   ));
// };

// export const openConfirmPromise = (title, message, successButtonLabel) => {
//   return new Promise((resolve, reject) => {
//     openConfirm(
//       title,
//       message,
//       successButtonLabel,
//       async ({ close }) => {
//         close();
//         resolve(true);
//       },
//       async ({ close }) => {
//         close();
//         resolve(false);
//       }
//     );
//   });
// };
