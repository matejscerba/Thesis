import React from "react";
import { Product } from "../../types/product";
import { DiscardProductButton, FinalChoiceSelectedButton, MoveToCandidatesButton } from "./Buttons";
import { Event } from "../../types/event";
import { useCategory } from "../../contexts/category";

interface AlternativeMenuProps {
  product: Product;
}

/**
 * This component renders menu of an alternative product.
 *
 * @param {AlternativeMenuProps} props
 * @param {Product} props.product the product for which to display the menu
 * @constructor
 */
function AlternativeMenu({ product }: AlternativeMenuProps) {
  const { onMarkCandidate, onDiscard } = useCategory();

  return (
    <>
      <FinalChoiceSelectedButton
        product={product}
        clickEvent={Event.ALTERNATIVE_FINAL_CHOICE_SELECTED}
        confirmEvent={Event.ALTERNATIVE_FINAL_CHOICE_CONFIRMED}
      />
      <MoveToCandidatesButton
        product={product}
        clickEvent={Event.ALTERNATIVE_ADDED_TO_CANDIDATES}
        onMarkCandidate={(productId) => {
          onMarkCandidate([productId]);
        }}
      />
      <DiscardProductButton
        product={product}
        clickEvent={Event.ALTERNATIVE_DISCARDED}
        onDiscard={(productId) => {
          onDiscard([productId]);
        }}
      />
    </>
  );
}

export default AlternativeMenu;
