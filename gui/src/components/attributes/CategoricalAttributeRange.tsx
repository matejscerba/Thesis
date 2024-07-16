import React from "react";
import { Attribute } from "../../types/attribute";
import AttributeRange from "./AttributeRange";
import Typography from "@mui/material/Typography";
import { valueToString } from "../../utils/attributes";

interface CategoricalAttributeOptionProps {
  option: any;
  attribute: Attribute;
  selected?: boolean;
}

/**
 * This component renders an option of a categorical attribute.
 *
 * @param option the value of the option to render
 * @param attribute the attribute to which the option belongs
 * @param selected specifies whether the option is selected and should thus be highlighted
 * @constructor
 */
function CategoricalAttributeOption({ option, attribute, selected }: CategoricalAttributeOptionProps) {
  const bgColor = selected ? "success" : "secondary";
  return (
    <div className={`flex-item border border-${bgColor} rounded text-bg-${bgColor} m-1 px-2`}>
      <Typography variant="body1">{valueToString(option, attribute)}</Typography>
    </div>
  );
}

interface CategoricalAttributeRangeProps {
  attribute: Attribute;
  selectedOptions: any[];
  availableOptions: any[];
  numProductsInRange: number;
}

/**
 * This component renders the "range" of a categorical attribute - the selected and other available options.
 *
 * @param attribute the attribute which range should be rendered
 * @param selectedOptions the selected options
 * @param availableOptions the other available options
 * @param numProductsInRange the number of products in the relevant range (with the selected attribute options)
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
          <CategoricalAttributeOption
            key={valueToString(option, attribute)}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            option={option}
            attribute={attribute}
            selected
          />
        ))}
        {availableOptions.map((option) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <CategoricalAttributeOption key={valueToString(option, attribute)} option={option} attribute={attribute} />
        ))}
      </div>
    </AttributeRange>
  );
}

export default CategoricalAttributeRange;
