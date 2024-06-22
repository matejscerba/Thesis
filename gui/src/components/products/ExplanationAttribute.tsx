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
