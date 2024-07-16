import Typography from "@mui/material/Typography";
import React from "react";
import { Attribute } from "../../types/attribute";
import { getBgColor, getColor, valueToString } from "../../utils/attributes";
import PositionTooltip from "./PositionTooltip";

interface ExplanationAttributeProps {
  attribute: Attribute;
  value: any;
  position: string;
}

/**
 * This component renders an attibute with its explanations.
 *
 * @param attribute attribute to be rendered
 * @param value value of the attribute to be rendered
 * @param position position of the attribute's value - the type of explanation
 * @constructor
 */
function ExplanationAttribute({ attribute, value, position }: ExplanationAttributeProps) {
  const color = getColor(position);
  const bgColor = getBgColor(position);

  return (
    <PositionTooltip position={position} attribute={attribute}>
      <div className={`flex-item m-1 px-2 border border-${color} bg-${bgColor}-subtle rounded`}>
        <div className="name">
          <Typography variant="body1">{attribute.name}</Typography>
        </div>
        <div className="value">
          <Typography variant="body1">{valueToString(value, attribute)}</Typography>
        </div>
      </div>
    </PositionTooltip>
  );
}

export default ExplanationAttribute;
