import { FilterValueResponse, MultiFilter } from "./attribute";

interface StoppingCriterionAttributeResponse {
  attribute_name: string;
  filter: FilterValueResponse;
}

export interface StoppingCriterionItem {
  supportSet: MultiFilter;
  attributeValue: MultiFilter;
  numProducts: number;
  metric: number;
}

export interface StoppingCriterionItemResponse {
  support_set: StoppingCriterionAttributeResponse[];
  attribute_value: StoppingCriterionAttributeResponse[];
  num_products: number;
  metric: number;
}

export interface StoppingCriteria {
  preferenceDetected: boolean;
  reached: boolean;
  items: StoppingCriterionItem[];
}

export interface StoppingCriteriaResponse {
  preference_detected: boolean;
  reached: boolean;
  items: StoppingCriterionItemResponse[];
}
