import { Attribute } from "../types/attribute";

export function valueToString(value: any, attribute: Attribute) {
  return `${value}${attribute.unit ? " " + attribute.unit : ""}`;
}
