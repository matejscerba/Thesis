import React from "react";
import { Product } from "../../types/product";
import { Event } from "../../types/event";
import { MultiFilter } from "../../types/attribute";
import { DiscardProductButton, FinalChoiceSelectedButton, MoveToCandidatesButton } from "./Buttons";

interface FilteredMenuProps {
  product: Product;
  filter: MultiFilter;
  onMarkCandidate: (productId: number) => void;
  onDiscard: (productId: number) => void;
  isCandidate?: boolean;
  isDiscarded?: boolean;
}

/**
 * This component renders menu of a filtered product.
 *
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function FilteredMenu({ product, filter, onMarkCandidate, onDiscard, isCandidate, isDiscarded }: FilteredMenuProps) {
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
        onMarkCandidate={onMarkCandidate}
        isActive={isCandidate}
      />
      <DiscardProductButton
        productId={product.id}
        event={Event.FILTERED_PRODUCT_DISCARDED}
        data={{ filter }}
        onDiscard={onDiscard}
        isActive={isDiscarded}
      />
    </>
  );
}

export default FilteredMenu;
