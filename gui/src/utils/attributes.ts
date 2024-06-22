import { Attribute, PRICE } from "../types/attribute";
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
  if (position === ProductAttributePosition.BEST.valueOf()) {
    return "success";
  } else if (position === ProductAttributePosition.BEST_RATED.valueOf()) {
    return "info";
  } else if (position === ProductAttributePosition.NEUTRAL.valueOf()) {
    return "secondary";
  } else if (position === ProductAttributePosition.WORST_RATED.valueOf()) {
    return "warning";
  } else if (position === ProductAttributePosition.WORST.valueOf()) {
    return "danger";
  }
  return undefined;
}
