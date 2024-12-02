import React from "react";
import { Product } from "../../types/product";
import { Event } from "../../types/event";
import { MultiFilter } from "../../types/attribute";
import { DiscardProductButton, FinalChoiceSelectedButton, MoveToCandidatesButton } from "./Buttons";

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
  return (
    <>
      <FinalChoiceSelectedButton
        productId={product.id}
        event={Event.FILTERED_FINAL_CHOICE_SELECTED}
        data={{ filter }}
      />
      <MoveToCandidatesButton
        productId={product.id}
        event={Event.FILTERED_PRODUCT_ADDED_TO_CANDIDATES}
        data={{ filter }}
      />
      <DiscardProductButton productId={product.id} event={Event.FILTERED_PRODUCT_DISCARDED} data={{ filter }} />
    </>
  );
}

export default FilteredMenu;
