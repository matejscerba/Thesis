import { Attribute, PRICE } from "../types/attribute";

export function valueToString(value: any, attribute: Attribute) {
  if (attribute.full_name === PRICE) {
    value = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value as number);
  }
  return `${value}${attribute?.unit ? " " + attribute.unit : ""}`;
}
