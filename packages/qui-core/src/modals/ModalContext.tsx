import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { useParams } from "react-router-dom";

interface ModalContextType {
  openModal: (modalComponent: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export function ModalContextProvider({ children }: PropsWithChildren) {
  const [modals, setModals] = useState<ReactNode[]>([] as ReactNode[]);

  const openModal = (modalComponent: ReactNode) => {
    setModals((m) => [...m, modalComponent]);
  };

  const closeModal = () => {
    setModals((m) => [...m.slice(0, m.length - 1)]);
  };

  const params = useParams();
  console.log("ModalContextProvider", params);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  return useContext(ModalContext);
}
