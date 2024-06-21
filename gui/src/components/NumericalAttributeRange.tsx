import React from "react";
import { Slider } from "@mui/material";
import { Attribute } from "../types/attribute";
import { valueToString } from "../utils/attributes";
import AttributeRange from "./AttributeRange";

interface NumericalAttributeRangeProps {
  category: string;
  attribute: Attribute;
  lowerBoundIndex: number;
  upperBoundIndex: number;
  options: number[];
  numProductsInRange: number;
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function NumericalAttributeRange({
  category,
  attribute,
  lowerBoundIndex,
  upperBoundIndex,
  options,
  numProductsInRange,
  onDiscard,
  onMarkCandidate,
}: NumericalAttributeRangeProps) {
  const lowerBound = options[lowerBoundIndex];
  const upperBound = options[upperBoundIndex];

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
        value={[lowerBoundIndex, upperBoundIndex]}
        min={0}
        max={options.length - 1}
        valueLabelDisplay="off"
        marks={[
          { value: lowerBoundIndex, label: valueToString(lowerBound, attribute) },
          { value: upperBoundIndex, label: valueToString(upperBound, attribute) },
        ]}
        color="success"
      />
    </AttributeRange>
  );
}

export default NumericalAttributeRange;
