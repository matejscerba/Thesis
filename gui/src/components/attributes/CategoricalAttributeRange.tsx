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
