import { Product, ProductExplanationMessage, ProductExplanationMessageCode, ProductGroupType } from "../types/product";
import AlternativeMenu from "../components/menus/AlternativeMenu";
import React from "react";
import CandidateMenu from "../components/menus/CandidateMenu";
import DiscardedMenu from "../components/menus/DiscardedMenu";

/**
 * Gets explanation text and info of an explanation message.
 *
 * @param message the explanation message
 * @return {object} text and info of the explanation message
 */
export function getProductExplanationMessageInfo(message: ProductExplanationMessage): { text: string; info: string } {
  switch (message?.code) {
    case ProductExplanationMessageCode.BETTER_THAN_ALL_CANDIDATES.valueOf():
      return {
        text: "Better than all candidates",
        info: "All important numerical attributes have better value than every candidate",
      };
    default:
      return undefined;
  }
}

/**
 * Gets menu element for given product, based on the product's group type.
 *
 * @param product product for which to get menu
 * @param groupType group type of the product
 * @return {React.JSX.Element} menu element
 */
export function getMenuForProduct(product: Product, groupType: ProductGroupType): React.JSX.Element {
  switch (groupType) {
    case ProductGroupType.UNSEEN:
    case ProductGroupType.ALTERNATIVES:
      return <AlternativeMenu product={product} />;
    case ProductGroupType.CANDIDATES:
      return <CandidateMenu product={product} />;
    case ProductGroupType.DISCARDED:
      return <DiscardedMenu product={product} />;
    default:
      return null;
  }
}

/**
 * Gets bootstrap color name for given group type
 *
 * @param groupType group type for which to get bootstrap color
 * @return {string} bootsrap color name for given group type
 */
export function getColor(groupType: ProductGroupType): string {
  switch (groupType) {
    case ProductGroupType.UNSEEN:
      return "secondary";
    case ProductGroupType.ALTERNATIVES:
      return "info";
    case ProductGroupType.CANDIDATES:
      return "success";
    case ProductGroupType.DISCARDED:
      return "danger";
    default:
      return null;
  }
}

/**
 * Gets message saying "no products in this group".
 *
 * @param groupType group type for which to get message
 * @return {string} message saying "no products in this group"
 */
export function getEmptyMessage(groupType: ProductGroupType): string {
  switch (groupType) {
    case ProductGroupType.UNSEEN:
      return "No products found";
    case ProductGroupType.ALTERNATIVES:
      return "No alternative products found";
    case ProductGroupType.CANDIDATES:
      return "No candidate products found";
    case ProductGroupType.DISCARDED:
      return "No discarded products found";
    default:
      return null;
  }
}
