import React from "react";
import { Product } from "../../types/product";
import { Tooltip } from "@mui/material";
import { useCategory } from "../../contexts/category";
import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";
import { MultiFilter } from "../../types/attribute";

interface FilteredMenuProps {
  product: Product;
  filter: MultiFilter;
}

/**
 * This component renders menu of a filtered product.
 *
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function FilteredMenu({ product, filter }: FilteredMenuProps) {
  const { onDiscard, onMarkCandidate } = useCategory();

  return (
    <>
      <Tooltip title="Move to candidates">
        <button
          type="button"
          className="btn btn-sm btn-outline-success me-2"
          onClick={() => {
            logEvent(Event.FILTERED_PRODUCT_ADDED_TO_CANDIDATES, { product_id: product.id, filter });
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
            logEvent(Event.FILTERED_PRODUCT_DISCARDED, { product_id: product.id, filter });
            onDiscard(product.id);
          }}
        >
          <i className="bi bi-trash-fill" />
        </button>
      </Tooltip>
    </>
  );
}

export default FilteredMenu;
