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
 * This component renders an attibute with its explanations.
 *
 * @param {Attribute} attribute attribute to be rendered
 * @param {any} value value of the attribute to be rendered
 * @param {string} position position of the attribute's value - the type of explanation
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
          <Typography variant="body1">{valueToString(filter.options[0], attribute)}</Typography>
        </div>
      </div>
    </PositionTooltip>
  );
}

export default ExplanationAttribute;
