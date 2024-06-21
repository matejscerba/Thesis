export interface Attribute {
  full_name: string;
  name: string;
  unit: string | null;
  group: string;
  type: string;
}

export enum AttributeType {
  CATEGORICAL = "categorical",
  NUMERICAL = "numerical",
}
