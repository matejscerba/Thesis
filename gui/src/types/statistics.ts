import { Attribute } from "./attribute";

/**
 * Represents statistics regarding a single attribute.
 */
export interface AttributeStatistics {
  /**
   * Attribute the statistics concern.
   */
  attribute: Attribute;

  /**
   * Number of not yet seen products with relevant value of the attribute.
   */
  num_products: number;

  /**
   * Index of the lower bound value among options.
   */
  lower_bound_index?: number;

  /**
   * Index of the upper bound value among options.
   */
  upper_bound_index?: number;

  /**
   * Possible options of the attribute. Numerical. Ordered.
   */
  options?: number[];

  /**
   * Selected (relevant) values of a categorical attribute.
   */
  selected_options?: any[];

  /**
   * Not selected (not relevant) values of a categorical attribute.
   */
  available_options?: any[];
}

/**
 * Represents statistics of the unseen products.
 */
export interface UnseenStatistics {
  /**
   * Statistics of several attributes. Typically the important ones.
   */
  attributes: AttributeStatistics[];
}
