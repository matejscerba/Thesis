import { Attribute } from "./attribute";

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
}

export enum ProductAttributePosition {
  BETTER = "better",
  BEST = "best",
  NEUTRAL = "neutral",
  RELEVANT = "relevant",
  WORST = "worst",
  WORSE = "worse",
  HIGHER_RATED = "higher_rated",
  HIGHEST_RATED = "highest_rated",
  LOWEST_RATED = "lowest_rated",
  LOWER_RATED = "lower_rated",
}

export enum ProductExplanationMessageCode {
  NONE = "none",
  BETTER_THAN_ALL_CANDIDATES = "better_than_all_candidates",
}

export interface ProductExplanationMessage {
  code: string;
}

interface ProductAttributeExplanation {
  attribute: Attribute;
  attribute_value: any;
  position: string;
}

export interface ProductExplanation {
  message: ProductExplanationMessage;
  attributes: ProductAttributeExplanation[];
  price_position: string;
}
