import React from "react";
import { Product } from "../../types/product";
import { Event } from "../../types/event";
import { DiscardProductButton, FinalChoiceSelectedButton } from "./Buttons";

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
  return (
    <>
      <FinalChoiceSelectedButton productId={product.id} event={Event.CANDIDATE_FINAL_CHOICE_SELECTED} />
      <DiscardProductButton productId={product.id} event={Event.CANDIDATE_DISCARDED} />
    </>
  );
}

export default CandidateMenu;
