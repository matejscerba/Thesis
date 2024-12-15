import { FilterValueResponse, MultiFilter } from "./attribute";

/**
 * Represents the stopping criterion attribute as returned by the server.
 */
interface StoppingCriterionAttributeResponse {
  /**
   * The name of the attribute.
   */
  attribute_name: string;

  /**
   * The filter of the attribute's values.
   */
  filter: FilterValueResponse;
}

/**
 * Represents the stopping criterion.
 */
export interface StoppingCriterionItem {
  /**
   * The support set of the stopping criterion.
   */
  supportSet: MultiFilter;

  /**
   * The attribute value of the stopping criterion.
   */
  attributeValue: MultiFilter;

  /**
   * The number of not yet seen products satisfying the stopping criterion.
   */
  numProducts: number;

  /**
   * The value of the metric.
   */
  metric: number;
}

/**
 * Represents the stopping criterion item as returned by the server.
 */
export interface StoppingCriterionItemResponse {
  /**
   * The support set of the stopping criterion.
   */
  support_set: StoppingCriterionAttributeResponse[];

  /**
   * The attribute value of the stopping criterion.
   */
  attribute_value: StoppingCriterionAttributeResponse[];

  /**
   * The number of not yet seen products satisfying the stopping criterion.
   */
  num_products: number;

  /**
   * The value of the metric.
   */
  metric: number;
}

/**
 * Represents the stopping criteria.
 */
export interface StoppingCriteria {
  /**
   * The individual stopping criteria.
   */
  items: StoppingCriterionItem[];
}

/**
 * Represents the stopping criteria as returned by the server.
 */
export interface StoppingCriteriaResponse {
  /**
   * The individual stopping criteria.
   */
  items: StoppingCriterionItemResponse[];
}
