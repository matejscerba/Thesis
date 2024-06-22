import React from "react";
import { Product } from "../../types/product";
import { Tooltip } from "@mui/material";
import { useCategory } from "../../contexts/category";

interface AlternativeMenuProps {
  product: Product;
}

function AlternativeMenu({ product }: AlternativeMenuProps) {
  const { onDiscard, onMarkCandidate } = useCategory();

  return (
    <>
      <Tooltip title="Move to candidates">
        <button
          type="button"
          className="btn btn-sm btn-outline-success me-2"
          onClick={() => {
            onMarkCandidate(product.id);
          }}
        >
          <i className="bi bi-heart-fill" />
        </button>
      </Tooltip>
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

export default AlternativeMenu;
