import React from "react";
import Typography from "@mui/material/Typography";
import { useModal } from "../../contexts/modal";
import FilteredProducts from "../products/FilteredProducts";
import { Attribute } from "../../types/attribute";

interface AttributeRangeProps {
  attribute: Attribute;
  value: {
    lowerBound?: number;
    upperBound?: number;
    options?: any[];
  };
  numProductsInRange: number;
  children: React.ReactNode;
}

function AttributeRange({ attribute, value, numProductsInRange, children }: AttributeRangeProps) {
  const { presentModal } = useModal();

  return (
    <div className="px-3 py-2 attribute-range readonly">
      {numProductsInRange > 0 ? (
        <Typography
          className="text-center text-success clickable"
          variant="body1"
          onClick={() => {
            presentModal(<FilteredProducts attribute={attribute} value={value} />);
          }}
        >
          {numProductsInRange} products with relevant value
        </Typography>
      ) : (
        <Typography className="text-center text-danger" variant="body1">
          No products with relevant value
        </Typography>
      )}
      {children}
    </div>
  );
}

export default AttributeRange;
