import React from "react";
import { Slider } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useModal } from "../contexts/modal";
import FilteredProducts from "./FilteredProducts";
import { Attribute } from "../types/attribute";
import { valueToString } from "../utils/attributes";

interface AttributeRangeProps {
  category: string;
  attribute: Attribute;
  lowerBound: number;
  upperBound: number;
  numProductsInRange: number;
  onDiscard: (id: number) => void;
  onMarkCandidate: (id: number) => void;
}

function AttributeRange({
  category,
  attribute,
  lowerBound,
  upperBound,
  numProductsInRange,
  onDiscard,
  onMarkCandidate,
}: AttributeRangeProps) {
  const { presentModal } = useModal();

  const lowerBoundPosition = 1;
  const upperBoundPosition = 4;
  return (
    <div className="px-3 py-2 attribute-range readonly">
      {numProductsInRange > 0 ? (
        <Typography
          className="text-center text-success clickable"
          variant="body1"
          onClick={() => {
            presentModal(
              <FilteredProducts
                category={category}
                attribute={attribute}
                value={{ lowerBound, upperBound }}
                onDiscard={onDiscard}
                onMarkCandidate={onMarkCandidate}
              />,
            );
          }}
        >
          {numProductsInRange} products in relevant range
        </Typography>
      ) : (
        <Typography className="text-center text-danger" variant="body1">
          No products in relevant range
        </Typography>
      )}
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
    </div>
  );
}

export default AttributeRange;
