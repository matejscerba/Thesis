import React from "react";
import { Attribute } from "../types/attribute";
import AttributeRange from "./AttributeRange";
import Typography from "@mui/material/Typography";
import { valueToString } from "../utils/attributes";

interface CategoricalAttributeRangeProps {
  category: string;
  attribute: Attribute;
  options: any[];
  numProductsInRange: number;
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function CategoricalAttributeRange({
  category,
  attribute,
  options,
  numProductsInRange,
  onDiscard,
  onMarkCandidate,
}: CategoricalAttributeRangeProps) {
  return (
    <AttributeRange
      category={category}
      attribute={attribute}
      value={{ options }}
      numProductsInRange={numProductsInRange}
      onDiscard={onDiscard}
      onMarkCandidate={onMarkCandidate}
    >
      <div className="categorical-options-wrapper">
        {options.map((option) => (
          <div className="categorical-option border border-success rounded bg-success m-1 px-1">
            <Typography variant="body1" className="text-white">
              {valueToString(option, attribute)}
            </Typography>
          </div>
        ))}
      </div>
    </AttributeRange>
  );
}

export default CategoricalAttributeRange;
