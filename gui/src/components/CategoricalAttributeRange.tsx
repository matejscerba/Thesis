import React from "react";
import { Attribute } from "../types/attribute";
import AttributeRange from "./AttributeRange";
import Typography from "@mui/material/Typography";
import { valueToString } from "../utils/attributes";

interface CategoricalAttributeOptionProps {
  option: any;
  attribute: Attribute;
  selected?: boolean;
}

function CategoricalAttributeOption({ option, attribute, selected }: CategoricalAttributeOptionProps) {
  const bgColor = selected ? "success" : "secondary";
  const textColor = selected ? "white" : "white";
  return (
    <div className={`categorical-option border border-${bgColor} rounded bg-${bgColor} m-1 px-2`}>
      <Typography variant="body1" className={`text-${textColor}`}>
        {valueToString(option, attribute)}
      </Typography>
    </div>
  );
}

interface CategoricalAttributeRangeProps {
  category: string;
  attribute: Attribute;
  selectedOptions: any[];
  availableOptions: any[];
  numProductsInRange: number;
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function CategoricalAttributeRange({
  category,
  attribute,
  selectedOptions,
  availableOptions,
  numProductsInRange,
  onDiscard,
  onMarkCandidate,
}: CategoricalAttributeRangeProps) {
  return (
    <AttributeRange
      category={category}
      attribute={attribute}
      value={{ options: selectedOptions }}
      numProductsInRange={numProductsInRange}
      onDiscard={onDiscard}
      onMarkCandidate={onMarkCandidate}
    >
      <div className="categorical-options-wrapper">
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
