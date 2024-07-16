import React, { ReactElement } from "react";
import { ProductAttributePosition } from "../../types/product";
import { Tooltip } from "@mui/material";
import { getPositionText } from "../../utils/attributes";
import { Attribute } from "../../types/attribute";

interface PositionTooltipProps {
  position: string;
  attribute: Attribute;
  children: ReactElement<any, any>;
}

/**
 * This component wraps a React element into position (explanation) tooltip. Hovering over it displays a text if the
 * explanation is not neutral.
 *
 * @param position the position (explanation) to be displayed
 * @param attribute the attribute which is explained
 * @param children the React element to be wrapped
 * @constructor
 */
function PositionTooltip({ position, attribute, children }: PositionTooltipProps) {
  if (position === ProductAttributePosition.NEUTRAL.valueOf()) {
    return children;
  }

  const tooltipText = getPositionText(position, attribute.name, attribute.order);

  return <Tooltip title={tooltipText}>{children}</Tooltip>;
}

export default PositionTooltip;
