import React from "react";
import { Slider } from "@mui/material";
import { Attribute } from "../../types/attribute";
import { valueToString } from "../../utils/attributes";
import AttributeRange from "./AttributeRange";

interface NumericalAttributeRangeProps {
  attribute: Attribute;
  lowerBoundIndex: number;
  upperBoundIndex: number;
  options: number[];
  numProductsInRange: number;
}

/**
 * This component renders a numerical attribute's range given by lower and upper bound.
 *
 * @param {Attribute} attribute the attribute which range to be rendered
 * @param {number} lowerBoundIndex the index of a lower bound (its position in options)
 * @param {number} upperBoundIndex the index of an upper bound (its position in options)
 * @param {number[]} options all options of this attribute
 * @param {number} numProductsInRange number of products with attribute value in the range given by lower and upper bound
 * @constructor
 */
function NumericalAttributeRange({
  attribute,
  lowerBoundIndex,
  upperBoundIndex,
  options,
  numProductsInRange,
}: NumericalAttributeRangeProps) {
  const lowerBound = options[lowerBoundIndex];
  const upperBound = options[upperBoundIndex];

  return (
    <AttributeRange attribute={attribute} value={{ lowerBound, upperBound }} numProductsInRange={numProductsInRange}>
      <Slider
        className={lowerBound === undefined && upperBound === undefined ? "hidden-thumb" : ""}
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
