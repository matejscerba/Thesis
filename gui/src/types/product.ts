import { Attribute } from "./attribute";

export interface Product {
  id: number;
  name: string;
  price: number;
}

export enum ProductAttributePosition {
  BETTER = "better",
  BEST = "best",
  NEUTRAL = "neutral",
  WORST = "worst",
  WORSE = "worse",
  HIGHER_RATED = "higher_rated",
  HIGHEST_RATED = "highest_rated",
  LOWEST_RATED = "lowest_rated",
  LOWER_RATED = "lower_rated",
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
