import React from "react";
import { Product } from "../../types/product";
import { DiscardProductButton, FinalChoiceSelectedButton, MoveToCandidatesButton } from "./Buttons";
import { Event } from "../../types/event";

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
  return (
    <>
      <FinalChoiceSelectedButton productId={product.id} event={Event.ALTERNATIVE_FINAL_CHOICE_SELECTED} />
      <MoveToCandidatesButton productId={product.id} event={Event.ALTERNATIVE_ADDED_TO_CANDIDATES} />
      <DiscardProductButton productId={product.id} event={Event.ALTERNATIVE_DISCARDED} />
    </>
  );
}

export default AlternativeMenu;
