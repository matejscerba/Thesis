import { Modal } from "react-bootstrap";
import React from "react";
import { useModal } from "../contexts/modal";

/**
 * This component renders a modal that can be handled by modal context.
 *
 * @constructor
 */
function CategoryModal() {
  const { modalBody, show, hideModal } = useModal();

  return (
    <Modal show={show} onHide={hideModal} className="category-modal">
      <Modal.Header closeButton />
      <Modal.Body>{modalBody}</Modal.Body>
    </Modal>
  );
}

export default CategoryModal;
