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
 * @param {CandidateMenuProps} props
 * @param {Product} props.product the product for which to display the menu
 * @constructor
 */
function CandidateMenu({ product }: CandidateMenuProps) {
  const { onDiscard } = useCategory();

  return (
    <>
      <FinalChoiceSelectedButton
        product={product}
        clickEvent={Event.CANDIDATE_FINAL_CHOICE_SELECTED}
        confirmEvent={Event.CANDIDATE_FINAL_CHOICE_CONFIRMED}
      />
      <DiscardProductButton
        product={product}
        clickEvent={Event.CANDIDATE_DISCARDED}
        onDiscard={(productId) => {
          onDiscard([productId]);
        }}
      />
    </>
  );
}

export default CandidateMenu;
