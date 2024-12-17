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
 * @param {FilteredMenuProps} props
 * @param {Product} props.product the product for which to display the menu
 * @param {MultiFilter} props.filter the filter that is applied
 * @param {(productId: number) => void} props.onMarkCandidate action to perform when product is marked as candidate
 * @param {(productId: number) => void} props.onDiscard action to perform when product is discarded
 * @param {boolean} props.isCandidate whether product is candidate
 * @param {boolean} props.isDiscarded whether product is discarded
 * @constructor
 */
function FilteredMenu({ product, filter, onMarkCandidate, onDiscard, isCandidate, isDiscarded }: FilteredMenuProps) {
  return (
    <>
      <FinalChoiceSelectedButton
        product={product}
        clickEvent={Event.FILTERED_FINAL_CHOICE_SELECTED}
        confirmEvent={Event.FILTERED_FINAL_CHOICE_CONFIRMED}
        data={{ filter }}
      />
      <MoveToCandidatesButton
        product={product}
        clickEvent={Event.FILTERED_PRODUCT_ADDED_TO_CANDIDATES}
        data={{ filter }}
        onMarkCandidate={onMarkCandidate}
        isActive={isCandidate}
      />
      <DiscardProductButton
        product={product}
        clickEvent={Event.FILTERED_PRODUCT_DISCARDED}
        data={{ filter }}
        onDiscard={onDiscard}
        isActive={isDiscarded}
      />
    </>
  );
}

export default FilteredMenu;
