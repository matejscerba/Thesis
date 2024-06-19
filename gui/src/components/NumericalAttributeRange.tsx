import React from "react";
import { Slider } from "@mui/material";
import { Attribute } from "../types/attribute";
import { valueToString } from "../utils/attributes";
import AttributeRange from "./AttributeRange";

interface NumericalAttributeRangeProps {
  category: string;
  attribute: Attribute;
  lowerBound: number;
  upperBound: number;
  numProductsInRange: number;
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function NumericalAttributeRange({
  category,
  attribute,
  lowerBound,
  upperBound,
  numProductsInRange,
  onDiscard,
  onMarkCandidate,
}: NumericalAttributeRangeProps) {
  const lowerBoundPosition = 1;
  const upperBoundPosition = 4;
  return (
    <AttributeRange
      category={category}
      attribute={attribute}
      value={{ lowerBound, upperBound }}
      numProductsInRange={numProductsInRange}
      onDiscard={onDiscard}
      onMarkCandidate={onMarkCandidate}
    >
      <Slider
        value={[lowerBoundPosition, upperBoundPosition]}
        min={lowerBoundPosition - 1}
        max={upperBoundPosition + 1}
        valueLabelDisplay="auto"
        marks={[
          { value: lowerBoundPosition, label: valueToString(lowerBound, attribute) },
          { value: upperBoundPosition, label: valueToString(upperBound, attribute) },
        ]}
      />
    </AttributeRange>
  );
}

export default NumericalAttributeRange;
