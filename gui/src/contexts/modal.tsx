import React, { createContext, useContext, useState } from "react";

/**
 * Represents the modal context interface.
 */
interface ModalContextInterface {
  /**
   * Whether a modal is shown.
   */
  show: boolean;

  /**
   * The body of the modal - react node.
   */
  modalBody: React.ReactNode;

  /**
   * Sets a body of a modal to be displayed.
   *
   * @param {React.ReactNode} modalBody the body of the modal
   */
  presentModal: (modalBody: React.ReactNode) => void;

  /**
   * Hides the modal.
   */
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
 * @param {React.ReactNode} children the children (react node) to be wrapped into this provider
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
