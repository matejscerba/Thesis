import { Product, ProductExplanationMessage, ProductExplanationMessageCode, ProductGroupType } from "../types/product";
import AlternativeMenu from "../components/menus/AlternativeMenu";
import React from "react";
import CandidateMenu from "../components/menus/CandidateMenu";
import DiscardedMenu from "../components/menus/DiscardedMenu";

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

export function getMenuForProduct(product: Product, groupType: ProductGroupType) {
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

export function getColor(groupType: ProductGroupType) {
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

export function getEmptyMessage(groupType: ProductGroupType) {
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
