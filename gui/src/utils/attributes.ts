import { Attribute, AttributeOrder, PRICE } from "../types/attribute";
import { ProductAttributePosition } from "../types/product";

/**
 * Converts value of an attribute to string. Typically adds a unit if attribute has any.
 *
 * @param value value of an attribute
 * @param attribute the attribute to gather information about unit and format from
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
 * @param position position (explanation) to get the value from
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
 * Gets bootstrap color name of text for given explanation position.
 *
 * @param position position (explanation) to get the value from
 * @return {string} name of the bootstrap color compliant to the explanation position
 */
export function getTextColor(position: string): string {
  switch (position) {
    case ProductAttributePosition.NEUTRAL.valueOf():
    case ProductAttributePosition.RELEVANT.valueOf():
      return "dark";
    default:
      return getColor(position);
  }
}

/**
 * Gets bootstrap color name of background for given explanation position.
 *
 * @param position position (explanation) to get the value from
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
 * @param position position (explanation) to get the value from
 * @param order order of the attribute (asc/desc)
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
 * @param position position (explanation) to get the value from
 * @param override the name of the attribute, default `"value"`
 * @param order order of the attribute (asc/desc)
 * @return {string} textual representation of the explanation position
 */
export function getPositionText(position: string, override: string = "value", order?: string): string {
  const orderText = getOrderText(position, order);
  switch (position) {
    case ProductAttributePosition.BETTER.valueOf():
      return `Better${orderText} ${override} than any candidate`;
    case ProductAttributePosition.HIGHER_RATED.valueOf():
      return `Higher-rated ${override} than any candidate`;
    case ProductAttributePosition.BEST.valueOf():
      return `Best${orderText} ${override} of all candidates`;
    case ProductAttributePosition.HIGHEST_RATED.valueOf():
      return `Highest-rated ${override} of all candidates`;
    case ProductAttributePosition.RELEVANT.valueOf():
      return `Relevant ${override}`;
    case ProductAttributePosition.LOWEST_RATED.valueOf():
      return `Lowest-rated ${override} of all candidates`;
    case ProductAttributePosition.WORST.valueOf():
      return `Worst${orderText} ${override} of all candidates`;
    case ProductAttributePosition.LOWER_RATED.valueOf():
      return `Lower-rated ${override} than any candidate`;
    case ProductAttributePosition.WORSE.valueOf():
      return `Worse${orderText} ${override} than any candidate`;
    default:
      return undefined;
  }
}
