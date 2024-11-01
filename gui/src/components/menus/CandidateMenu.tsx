import React from "react";
import { Product } from "../../types/product";
import { Tooltip } from "@mui/material";
import { useCategory } from "../../contexts/category";

interface CandidateMenuProps {
  product: Product;
}

/**
 * This component renders menu of a candidate product.
 *
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function CandidateMenu({ product }: CandidateMenuProps) {
  const { onDiscard } = useCategory();

  return (
    <>
      <Tooltip title="Discard">
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => {
            onDiscard(product.id);
          }}
        >
          <i className="bi bi-trash-fill" />
        </button>
      </Tooltip>
    </>
  );
}

export default CandidateMenu;
