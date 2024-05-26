import React from "react";
import { Product } from "../types/product";
import { Tooltip } from "@mui/material";

interface AlternativeMenuProps {
  product: Product;
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function AlternativeMenu({ product, onDiscard, onMarkCandidate }: AlternativeMenuProps) {
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
