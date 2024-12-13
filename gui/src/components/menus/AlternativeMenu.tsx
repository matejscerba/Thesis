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
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function AlternativeMenu({ product }: AlternativeMenuProps) {
  const { onMarkCandidate, onDiscard } = useCategory();

  return (
    <>
      <FinalChoiceSelectedButton productId={product.id} event={Event.ALTERNATIVE_FINAL_CHOICE_SELECTED} />
      <MoveToCandidatesButton
        productId={product.id}
        event={Event.ALTERNATIVE_ADDED_TO_CANDIDATES}
        onMarkCandidate={(productId) => {
          onMarkCandidate([productId]);
        }}
      />
      <DiscardProductButton
        productId={product.id}
        event={Event.ALTERNATIVE_DISCARDED}
        onDiscard={(productId) => {
          onDiscard([productId]);
        }}
      />
    </>
  );
}

export default AlternativeMenu;
