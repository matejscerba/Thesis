import React from "react";
import { Product } from "../types/product";
import { Tooltip } from "@mui/material";

interface CandidateMenuProps {
  product: Product;
  onDiscard: (id: number) => void;
}

function CandidateMenu({ product, onDiscard }: CandidateMenuProps) {
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
