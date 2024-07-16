import React, { createContext, useContext, useState } from "react";

interface ModalContextInterface {
  show: boolean;
  modalBody: React.ReactNode;
  presentModal: (modalBody: React.ReactNode) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextInterface>({
  show: undefined,
  modalBody: undefined,
  presentModal: () => {},
  hideModal: () => {},
});

/**
 * This component wraps its children into context providing modal operations.
 *
 * @param children the children (react node) to be wrapped into this provider
 * @constructor
 */
export function ModalContextProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState<boolean>(false);
  const [modalBody, setModalBody] = useState<React.ReactNode>(undefined);

  return (
    <ModalContext.Provider
      value={{
        show,
        modalBody,
        presentModal: (modalBody) => {
          setModalBody(modalBody);
          setShow(true);
        },
        hideModal: () => {
          setModalBody(undefined);
          setShow(false);
        },
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
