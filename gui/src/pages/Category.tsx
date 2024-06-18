import React from "react";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/tools";
import ProductList from "../components/ProductList";
import CategorySidebar from "../components/CategorySidebar";
import { AttributesContextProvider } from "../contexts/attributes";
import { Modal } from "react-bootstrap";
import { useModal } from "../contexts/modal";

interface CategoryProps {
  name: string;
}

function Category({ name }: CategoryProps) {
  const { show, modalBody, hideModal } = useModal();
  return (
    <AttributesContextProvider category={name}>
      <div>
        <Typography variant="h2" className="mb-3" align="center">
          {capitalizeFirstLetter(name)}
        </Typography>
        <div className="category-layout">
          <div className="category-sidebar">
            <CategorySidebar name={name} />
          </div>
          <div className="category-content">
            <ProductList name={name} />
          </div>
        </div>
      </div>
      <Modal show={show} onHide={hideModal} className="category-modal">
        <Modal.Header closeButton />
        <Modal.Body>{modalBody}</Modal.Body>
      </Modal>
    </AttributesContextProvider>
  );
}

export default Category;
