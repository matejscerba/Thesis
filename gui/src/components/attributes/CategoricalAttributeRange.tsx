import React from "react";
import { Attribute } from "../../types/attribute";
import AttributeRange from "./AttributeRange";
import { valueToString } from "../../utils/attributes";
import AttributeOption from "./AttributeOption";

interface CategoricalAttributeRangeProps {
  attribute: Attribute;
  selectedOptions: any[];
  availableOptions: any[];
  numProductsInRange: number;
}

/**
 * This component renders the "range" of a categorical attribute - the selected and other available options.
 *
 * @param {Attribute} attribute the attribute which range should be rendered
 * @param {any[]} selectedOptions the selected options
 * @param {any[]} availableOptions the other available options
 * @param {number} numProductsInRange the number of products in the relevant range (with the selected attribute options)
 * @constructor
 */
function CategoricalAttributeRange({
  attribute,
  selectedOptions,
  availableOptions,
  numProductsInRange,
}: CategoricalAttributeRangeProps) {
  return (
    <AttributeRange attribute={attribute} value={{ options: selectedOptions }} numProductsInRange={numProductsInRange}>
      <div className="flex-wrapper center">
        {selectedOptions.map((option) => (
          <AttributeOption
            key={valueToString(option, attribute)}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            option={option}
            attribute={attribute}
            selected
          />
        ))}
        {availableOptions.map((option) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <AttributeOption key={valueToString(option, attribute)} option={option} attribute={attribute} />
        ))}
      </div>
    </AttributeRange>
  );
}

export default CategoricalAttributeRange;
