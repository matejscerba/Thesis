import React from "react";
import { Product } from "../../types/product";
import { Event } from "../../types/event";
import { DiscardProductButton, FinalChoiceSelectedButton } from "./Buttons";
import { useCategory } from "../../contexts/category";

interface CandidateMenuProps {
  product: Product;
}

/**
 * This component renders menu of a candidate product.
 *
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function CandidateMenu({ product }: CandidateMenuProps) {
  const { onDiscard } = useCategory();

  return (
    <>
      <FinalChoiceSelectedButton productId={product.id} event={Event.CANDIDATE_FINAL_CHOICE_SELECTED} />
      <DiscardProductButton
        productId={product.id}
        event={Event.CANDIDATE_DISCARDED}
        onDiscard={(productId) => {
          onDiscard([productId]);
        }}
      />
    </>
  );
}

export default CandidateMenu;
