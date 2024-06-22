import React from "react";
import { Product } from "../../types/product";
import { Tooltip } from "@mui/material";
import { useCategory } from "../../contexts/category";

interface DiscardedMenuProps {
  product: Product;
}

function DiscardedMenu({ product }: DiscardedMenuProps) {
  const { onMarkCandidate } = useCategory();

  return (
    <Tooltip title="Put back to candidates">
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
  );
}

export default DiscardedMenu;
