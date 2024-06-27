import { ProductExplanationMessage, ProductExplanationMessageCode } from "../types/product";

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
