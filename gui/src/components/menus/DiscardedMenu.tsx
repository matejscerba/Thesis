import React from "react";
import { Product } from "../../types/product";
import { Event } from "../../types/event";
import { MoveToCandidatesButton } from "./Buttons";
import { useCategory } from "../../contexts/category";

interface DiscardedMenuProps {
  product: Product;
}

/**
 * This component renders menu of a discarded product.
 *
 * @param {} props
 * @param {Product} props.product the product for which to display the menu
 * @constructor
 */
function DiscardedMenu({ product }: DiscardedMenuProps) {
  const { onMarkCandidate } = useCategory();

  return (
    <MoveToCandidatesButton
      product={product}
      clickEvent={Event.DISCARDED_ADDED_TO_CANDIDATES}
      onMarkCandidate={(productId) => {
        onMarkCandidate([productId]);
      }}
    />
  );
}

export default DiscardedMenu;
