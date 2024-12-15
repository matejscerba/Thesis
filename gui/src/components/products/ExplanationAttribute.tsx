import Typography from "@mui/material/Typography";
import React from "react";
import { Attribute, FilterValue } from "../../types/attribute";
import { getBgColor, getColor, valueToString } from "../../utils/attributes";
import PositionTooltip from "./PositionTooltip";

interface ExplanationAttributeProps {
  attribute: Attribute;
  filter: FilterValue;
  position: string;
}

/**
 * This component renders an attribute with its explanations.
 *
 * @param {ExplanationAttributeProps} props
 * @param {Attribute} props.attribute attribute to be rendered
 * @param {FilterValue} props.filter filter of the attribute to be rendered
 * @param {string} props.position position of the attribute's value - the type of explanation
 * @constructor
 */
function ExplanationAttribute({ attribute, filter, position }: ExplanationAttributeProps) {
  const color = getColor(position);
  const bgColor = getBgColor(position);

  return (
    <PositionTooltip position={position} attribute={attribute}>
      <div className={`flex-item m-1 px-2 border border-${color} bg-${bgColor}-subtle rounded`}>
        <div className="name">
          <Typography variant="body1">{attribute.name}</Typography>
        </div>
        <div className="value">
          {filter.options ? (
            filter.options.length === 1 ? (
              <Typography variant="body1">{valueToString(filter.options[0], attribute)}</Typography>
            ) : (
              <Typography variant="body1">
                {filter.options.map((option) => valueToString(option, attribute)).join(", ")}
              </Typography>
            )
          ) : (
            <>
              {filter.lowerBound !== null && (
                <Typography variant="body1">from {valueToString(filter.lowerBound, attribute)}</Typography>
              )}
              {filter.upperBound !== null && (
                <Typography variant="body1">up to {valueToString(filter.upperBound, attribute)}</Typography>
              )}
              {filter.lowerBound === null && filter.upperBound === null && <Typography variant="body1">Any</Typography>}
            </>
          )}
        </div>
      </div>
    </PositionTooltip>
  );
}

export default ExplanationAttribute;
