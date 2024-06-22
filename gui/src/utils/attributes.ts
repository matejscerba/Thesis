import { Attribute, AttributeOrder, PRICE } from "../types/attribute";
import { ProductAttributePosition } from "../types/product";

export function valueToString(value: any, attribute: Attribute) {
  if (attribute.full_name === PRICE && value !== undefined && value !== null) {
    value = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value as number);
  }
  return `${value ?? "-"}${attribute?.unit ? " " + attribute.unit : ""}`;
}

export function getColor(position: string) {
  switch (position) {
    case ProductAttributePosition.BEST.valueOf():
    case ProductAttributePosition.BETTER.valueOf():
      return "success";
    case ProductAttributePosition.HIGHEST_RATED.valueOf():
    case ProductAttributePosition.HIGHER_RATED.valueOf():
      return "primary";
    case ProductAttributePosition.NEUTRAL.valueOf():
      return "secondary";
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

export function getTextColor(position: string) {
  if (position === ProductAttributePosition.NEUTRAL.valueOf()) {
    return "dark";
  }
  return getColor(position);
}

export function getBgColor(position: string) {
  if (position === ProductAttributePosition.NEUTRAL.valueOf()) {
    return undefined;
  }
  return getColor(position);
}

function getOrderText(position: string, order?: string) {
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

export function getPositionText(position: string, override: string = "value", order?: string) {
  const orderText = getOrderText(position, order);
  override = override.toLowerCase();
  switch (position) {
    case ProductAttributePosition.BETTER.valueOf():
      return `Better${orderText} ${override} than any candidate`;
    case ProductAttributePosition.HIGHER_RATED.valueOf():
      return `Higher-rated ${override} than any candidate`;
    case ProductAttributePosition.BEST.valueOf():
      return `Best${orderText} ${override} of all candidates`;
    case ProductAttributePosition.HIGHEST_RATED.valueOf():
      return `Highest-rated ${override} of all candidates`;
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
