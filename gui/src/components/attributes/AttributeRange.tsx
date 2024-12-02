import React from "react";
import Typography from "@mui/material/Typography";
import { useModal } from "../../contexts/modal";
import FilteredProducts from "../products/FilteredProducts";
import { Attribute, FilterValue } from "../../types/attribute";
import { getFilterValueText } from "../../utils/attributes";
import { logEvent } from "../../utils/api";
import { Event } from "../../types/event";

interface AttributeRangeProps {
  attribute: Attribute;
  value: FilterValue;
  numProductsInRange: number;
  children: React.ReactNode;
}

/**
 * This component renders a range of an attribute.
 *
 * @param {Attribute} attribute attribute which range to render
 * @param {FilterValue} value specification of the range by means of value
 * @param {number} numProductsInRange number of products in the range defined by `value` parameter
 * @param {React.ReactNode} children react node to display inside this component
 * @constructor
 */
function AttributeRange({ attribute, value, numProductsInRange, children }: AttributeRangeProps) {
  const { presentModal } = useModal();

  const filter = [
    {
      attribute,
      filter: value,
    },
  ];

  return (
    <div className="px-3 py-2 attribute-range">
      <Typography variant="h6" className="text-center">
        {attribute.name}
      </Typography>
      {numProductsInRange > 0 ? (
        <Typography
          className="text-center text-success clickable"
          variant="body1"
          onClick={() => {
            logEvent(Event.UNSEEN_STATISTIC_OPENED, { filter });
            presentModal(<FilteredProducts filter={filter} />);
          }}
        >
          {numProductsInRange} more products with relevant value ({getFilterValueText(attribute, value)})
        </Typography>
      ) : (
        <Typography className="text-center text-danger" variant="body1">
          No more products with relevant value ({getFilterValueText(attribute, value)})
        </Typography>
      )}
      {children}
    </div>
  );
}

export default AttributeRange;
