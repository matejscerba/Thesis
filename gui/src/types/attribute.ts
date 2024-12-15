/**
 * Represents as attribute.
 */
export interface Attribute {
  /**
   * Full name of the attribute. Typically, contains unit in square brackets.
   */
  full_name: string;

  /**
   * Frontend-ready name of the attribute.
   */
  name: string;

  /**
   * Unit of the attribute.
   */
  unit: string;

  /**
   * Name of the group of the attribute.
   */
  group: string;

  /**
   * Type of the attribute. Value of `AttributeType` enum.
   */
  type: string;

  /**
   * Order of the attribute. Value of `AttributeOrder` enum.
   */
  order: string;

  /**
   * Specifies whether attribute value is continuous.
   */
  continuous: boolean;
}

/**
 * Represents a filter of an attribute's values
 */
export interface FilterValue {
  /**
   * The lower bound of a numerical attribute.
   */
  lowerBound?: number;

  /**
   * The upper bound of a numerical attribute.
   */
  upperBound?: number;

  /**
   * Values of the attribute to be filtered.
   */
  options?: any[];
}

/**
 * Represents filter of an attribute's values as returned by the server.
 */
export interface FilterValueResponse {
  /**
   * The lower bound of a numerical attribute.
   */
  lower_bound?: number;

  /**
   * The upper bound of a numerical attribute.
   */
  upper_bound?: number;

  /**
   * Values of the attribute to be filtered.
   */
  options?: any[];
}

/**
 * Represents filter of an attribute's values.
 */
export interface MultiFilterItem {
  /**
   * The attribute which values are filtered.
   */
  attribute: Attribute;

  /**
   * The filter of the attribute's values.
   */
  filter: FilterValue;
}

/**
 * Represents filter of multiple attributes' values.
 */
export type MultiFilter = MultiFilterItem[];

/**
 * Represents the type of attribute.
 */
export enum AttributeType {
  CATEGORICAL = "categorical",
  NUMERICAL = "numerical",
}

/**
 * Represents the order of attribute.
 */
export enum AttributeOrder {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

/**
 * Full name of the Price attribute.
 */
export const PRICE = "Price [CZK]";
