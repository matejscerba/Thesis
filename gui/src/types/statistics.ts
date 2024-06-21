import { Attribute } from "./attribute";

interface AttributeStatistics {
  attribute: Attribute;
  num_products: number;
  lower_bound_index?: number;
  upper_bound_index?: number;
  options?: number[];
  selected_options?: any[];
  available_options?: any[];
}

export interface UnseenStatistics {
  attributes: AttributeStatistics[];
}
