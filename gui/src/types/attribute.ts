export interface Attribute {
  full_name: string;
  name: string;
  unit: string;
  group: string;
  type: string;
  order: string;
  continuous: boolean;
}

export enum AttributeType {
  CATEGORICAL = "categorical",
  NUMERICAL = "numerical",
}

export enum AttributeOrder {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

export const PRICE = "Price [CZK]";
export const PRICE_NO_VAT = "Price without VAT [CZK]";
export const AVAILABILITY = "Availability";
