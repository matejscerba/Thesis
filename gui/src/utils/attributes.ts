import { Attribute, AttributeOrder, FilterValue, MultiFilter, PRICE } from "../types/attribute";
import { ProductAttributePosition } from "../types/product";

/**
 * Converts value of an attribute to string. Typically, adds a unit if attribute has any.
 *
 * @param {any} value value of an attribute
 * @param {Attribute} attribute the attribute to gather information about unit and format from
 * @return {string} formatted value
 */
export function valueToString(value: any, attribute: Attribute): string {
  if (attribute.full_name === PRICE && value !== undefined && value !== null) {
    value = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value as number);
  }
  return `${value ?? "-"}${attribute?.unit ? " " + attribute.unit : ""}`;
}

/**
 * Gets bootstrap color name for given explanation position.
 *
 * @param {string} position position (explanation) to get the value from
 * @return {string} name of the bootstrap color compliant to the explanation position
 */
export function getColor(position: string): string {
  switch (position) {
    case ProductAttributePosition.BEST.valueOf():
    case ProductAttributePosition.BETTER.valueOf():
      return "info";
    case ProductAttributePosition.HIGHEST_RATED.valueOf():
    case ProductAttributePosition.HIGHER_RATED.valueOf():
      return "primary";
    case ProductAttributePosition.NEUTRAL.valueOf():
      return "secondary";
    case ProductAttributePosition.RELEVANT.valueOf():
      return "success";
    case ProductAttributePosition.LOWEST_RATED.valueOf():
    case ProductAttributePosition.LOWER_RATED.valueOf():
      return "warning";
    case ProductAttributePosition.WORST.valueOf():
    case ProductAttributePosition.WORSE.valueOf():
      return "danger";
    default:
      return undefined;
  }
}

/**
 * Gets bootstrap color name of background for given explanation position.
 *
 * @param {string} position position (explanation) to get the value from
 * @return {string} name of the bootstrap color compliant to the explanation position
 */
export function getBgColor(position: string): string {
  if (position === ProductAttributePosition.NEUTRAL.valueOf()) {
    return undefined;
  }
  return getColor(position);
}

/**
 * Gets textual representation of the given explanation position and the attribute's order.
 *
 * @param {string} position position (explanation) to get the value from
 * @param {string} order order of the attribute (asc/desc)
 * @return {string} textual representation of the explanation position
 */
function getOrderText(position: string, order?: string): string {
  const lowest = " (lowest)";
  const lower = " (lower)";
  const higher = " (higher)";
  const highest = " (highest)";
  if (order === AttributeOrder.ASCENDING.valueOf()) {
    switch (position) {
      case ProductAttributePosition.BETTER.valueOf():
        return higher;
      case ProductAttributePosition.BEST.valueOf():
        return highest;
      case ProductAttributePosition.WORST.valueOf():
        return lowest;
      case ProductAttributePosition.WORSE.valueOf():
        return lower;
    }
  } else if (order === AttributeOrder.DESCENDING.valueOf()) {
    switch (position) {
      case ProductAttributePosition.BETTER.valueOf():
        return lower;
      case ProductAttributePosition.BEST.valueOf():
        return lowest;
      case ProductAttributePosition.WORST.valueOf():
        return highest;
      case ProductAttributePosition.WORSE.valueOf():
        return higher;
    }
  }
  return "";
}

/**
 * Gets textual representation of the given explanation position and the attribute's order with the name of the
 * attribute given in `override` parameter.
 *
 * @param {string} position position (explanation) to get the value from
 * @param {string} override the name of the attribute, default `"value"`
 * @param {string} order order of the attribute (asc/desc)
 * @return {string} textual representation of the explanation position
 */
export function getPositionText(position: string, override: string = "value", order?: string): string {
  const orderText = getOrderText(position, order);
  switch (position) {
    case ProductAttributePosition.BETTER.valueOf():
      return `Better${orderText} ${override} than any candidate`;
    case ProductAttributePosition.HIGHER_RATED.valueOf():
      return `Users rated this ${override} higher than any candidate`;
    case ProductAttributePosition.BEST.valueOf():
      return `Best${orderText} ${override} of all candidates`;
    case ProductAttributePosition.HIGHEST_RATED.valueOf():
      return `Users rated this ${override} highest of all candidates`;
    case ProductAttributePosition.RELEVANT.valueOf():
      return `Relevant ${override}`;
    case ProductAttributePosition.LOWEST_RATED.valueOf():
      return `Users rated this ${override} lowest of all candidates`;
    case ProductAttributePosition.WORST.valueOf():
      return `Worst${orderText} ${override} of all candidates`;
    case ProductAttributePosition.LOWER_RATED.valueOf():
      return `Users rated this ${override} lower than any candidate`;
    case ProductAttributePosition.WORSE.valueOf():
      return `Worse${orderText} ${override} than any candidate`;
    default:
      return undefined;
  }
}

/**
 * Gets text for filter value.
 *
 * @param {Attribute} attribute attribute over which filter is applied
 * @param {FilterValue} value value of the filter to be described
 * @return {string} textual representation of the filter value
 */
export function getFilterValueText(attribute: Attribute, value: FilterValue): string {
  if (value.options !== undefined && value.options !== null) {
    return value.options.length > 0
      ? `${value.options.length > 1 ? "one of " : ""}${value.options.map((val) => valueToString(val, attribute)).join(", ")}`
      : "-";
  }
  if ((value.lowerBound ?? -1) >= 0 && (value.upperBound ?? -1) >= 0) {
    if (value.lowerBound === value.upperBound) {
      return valueToString(value.lowerBound, attribute);
    } else {
      return `between ${valueToString(value.lowerBound, attribute)} and ${valueToString(value.upperBound, attribute)}`;
    }
  }
  return "-";
}

/**
 * Gets text for filter.
 *
 * @param {MultiFilter} filter filter for which to get the textual representation
 * @return {string} textual representation of the filter
 */
export function getFilterText(filter: MultiFilter): string {
  const validItems = filter.filter(
    (item) =>
      (item.filter.options !== undefined && item.filter.options !== null && item.filter.options.length > 0) ||
      ((item.filter.lowerBound ?? -1) >= 0 && (item.filter.upperBound ?? -1) >= 0),
  );
  if (validItems.length > 0) {
    return validItems
      .map((item) => `${item.attribute.name} ${getFilterValueText(item.attribute, item.filter)}`)
      .join(" and ");
  }
  return "-";
}
