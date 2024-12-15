import { Attribute } from "./attribute";

/**
 * Represents a product.
 */
export interface Product {
  /**
   * ID of the product.
   */
  id: number;

  /**
   * Name of the product.
   */
  name: string;

  /**
   * Price of the product.
   */
  price: number;

  /**
   * Rating of the product.
   */
  rating: number;
}

/**
 * Represents the position (explanation) of a product's attribute.
 */
export enum ProductAttributePosition {
  /**
   * Better than any candidate.
   */
  BETTER = "better",

  /**
   * Best of all candidates.
   */
  BEST = "best",

  /**
   * Not interesting.
   */
  NEUTRAL = "neutral",

  /**
   * Has relevant value.
   */
  RELEVANT = "relevant",

  /**
   * Worst of all candidates.
   */
  WORST = "worst",

  /**
   * Worse than any candidate.
   */
  WORSE = "worse",

  /**
   * Higher rated than any candidate.
   */
  HIGHER_RATED = "higher_rated",

  /**
   * Highest rated of all candidate.
   */
  HIGHEST_RATED = "highest_rated",

  /**
   * Lowest rated of all candidate.
   */
  LOWEST_RATED = "lowest_rated",

  /**
   * Lower rated than any candidate.
   */
  LOWER_RATED = "lower_rated",
}

/**
 * Represents the message code of a product explanation.
 */
export enum ProductExplanationMessageCode {
  NONE = "none",
  BETTER_THAN_ALL_CANDIDATES = "better_than_all_candidates",
  WORSE_THAN_ALL_CANDIDATES = "worse_than_all_candidates",
}

/**
 * Represents the message of a product explanation.
 */
export interface ProductExplanationMessage {
  /**
   * The code of the message.
   */
  code: string;
}

/**
 * Represents explanation of a product's attribute's value.
 */
interface ProductAttributeExplanation {
  /**
   * Attribute that is explained.
   */
  attribute: Attribute;

  /**
   * Value of the attribute that is explained.
   */
  attribute_value: any;

  /**
   * Position (explanation) of the attribute's value. Value of `ProductAttributePosition` enum.
   */
  position: string;
}

/**
 * Represents explanation of a product.
 */
export interface ProductExplanation {
  /**
   * Message for the whole product.
   */
  message: ProductExplanationMessage;

  /**
   * Explanations of several attributes. Typically, the important ones.
   */
  attributes: ProductAttributeExplanation[];
}

/**
 * Represents type of product group.
 */
export enum ProductGroupType {
  CANDIDATES = "candidates",
  ALTERNATIVES = "alternatives",
  UNSEEN = "unseen",
  DISCARDED = "discarded",
}
