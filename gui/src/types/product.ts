import { Attribute } from "./attribute";

export interface Product {
  id: number;
  name: string;
  price: number;
}

export enum ProductAttributePosition {
  BEST = "best",
  BEST_RATED = "best_rated",
  NEUTRAL = "neutral",
  WORST_RATED = "worst_rated",
  WORST = "worst",
}

interface ProductAttributeExplanation {
  attribute: Attribute;
  attribute_value: any;
  position: string;
}

export interface ProductExplanation {
  message: string;
  attributes: ProductAttributeExplanation[];
  price_position: string;
}
