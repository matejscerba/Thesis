import React from "react";
import { Product } from "../../types/product";
import { Event } from "../../types/event";
import { FinalChoiceSelectedButton, MoveToCandidatesButton } from "./Buttons";

interface DiscardedMenuProps {
  product: Product;
}

/**
 * This component renders menu of a discarded product.
 *
 * @param {Product} product the product for which to display the menu
 * @constructor
 */
function DiscardedMenu({ product }: DiscardedMenuProps) {
  return (
    <>
      <FinalChoiceSelectedButton productId={product.id} event={Event.DISCARDED_FINAL_CHOICE_SELECTED} />
      <MoveToCandidatesButton productId={product.id} event={Event.DISCARDED_ADDED_TO_CANDIDATES} />
    </>
  );
}

export default DiscardedMenu;
